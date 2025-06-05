-- AO Pay-to-Join Chatroom for Data Sharing
-- Agents can join by paying AO tokens and share subgraph data

-- State variables
Members = Members or {}
Memory = Memory or {}
AccessPrice = 1000  -- Tokens required to join (in AO token smallest unit)
AO_TOKEN_PROCESS = "hvM1eUc1_cGPlpguN55VqM9W7tWoakvYyhNrdWd5V50"  -- test token process ID

-- Utility functions
function get_member_count()
    local count = 0
    for _, member in pairs(Members) do
        if member.active then
            count = count + 1
        end
    end
    return count
end

function get_data_count()
    local count = 0
    for _ in pairs(Memory) do
        count = count + 1
    end
    return count
end

-- Handler for membership join requests
Handlers.add(
    "JoinRequest",
    { Action = "JoinRequest" },
    function(msg)
        local sender = msg.From
        
        -- Check if already an ACTIVE member
        if Members[sender] and Members[sender].active then
            msg.reply({
                Action = "JoinResponse",
                Data = "[Already Joined] Welcome back!",
                Status = "Success",
                Message = "Already a member"
            })
            return
        end
        
        -- If member exists but is inactive, they need to pay again
        if Members[sender] and not Members[sender].active then
            msg.reply({
                Action = "PaymentRequired",
                Data = "[Payment Required] You left the chatroom. Please send " .. AccessPrice .. " AO tokens to rejoin.",
                Status = "PaymentRequired",
                Amount = tostring(AccessPrice),
                TokenProcess = AO_TOKEN_PROCESS,
                Message = "Rejoining after leaving"
            })
            return
        end
        
        -- New member - request payment
        msg.reply({
            Action = "PaymentRequired",
            Data = "[Payment Required] Please send " .. AccessPrice .. " AO tokens to join.",
            Status = "PaymentRequired",
            Amount = tostring(AccessPrice),
            TokenProcess = AO_TOKEN_PROCESS
        })
    end
)

-- Handler for receiving token payments (Credit-Notice from AO token process)
Handlers.add(
    "CreditNotice",
    { Action = "Credit-Notice" },
    function(msg)
        -- ✅ SECURE - Only the token process can send this:
        if msg.From ~= AO_TOKEN_PROCESS then
            return
        end
        
        local from = msg.Tags.Sender or msg.From
        local quantity = tonumber(msg.Tags.Quantity) or 0
        
        -- Validate payment amount
        if quantity >= AccessPrice then
            -- Add member
            Members[from] = {
                joinedAt = msg.Timestamp or os.time(),
                paidAmount = quantity,
                active = true
            }
            
            -- Send confirmation to the new member
            Send({
                Target = from,
                Action = "JoinResponse",
                Data = "[Access Granted] Welcome to the AO data sharing chatroom!",
                Status = "Success",
                Message = "Successfully joined chatroom",
                PaidAmount = tostring(quantity)
            })
            
            -- Broadcast to existing members
            for member_id, member in pairs(Members) do
                if member_id ~= from and member.active then
                    Send({
                        Target = member_id,
                        Action = "MemberJoined",
                        Data = "[New Member] " .. from .. " joined the chatroom",
                        NewMember = from,
                        TotalMembers = tostring(get_member_count())
                    })
                end
            end
        else
            -- Insufficient payment - return tokens if any were sent
            if quantity > 0 and AO_TOKEN_PROCESS ~= "ANY" then
                Send({
                    Target = AO_TOKEN_PROCESS,
                    Action = "Transfer",
                    Tags = {
                        Recipient = from,
                        Quantity = tostring(quantity)
                    }
                })
            end
            
            Send({
                Target = from,
                Action = "PaymentInsufficient",
                Data = "[Payment Insufficient] Requires " .. AccessPrice .. " tokens. Sent: " .. quantity,
                Status = "Error",
                Required = tostring(AccessPrice),
                Sent = tostring(quantity)
            })
        end
    end
)

-- Handler for posting data/messages to shared memory
Handlers.add(
    "PostData",
    { Action = "PostData" },
    function(msg)
        local sender = msg.From
        
        -- Check membership
        if not Members[sender] or not Members[sender].active then
            msg.reply({
                Action = "PostRejected",
                Data = "[Access Denied] You are not a member.",
                Status = "Error",
                Message = "Not a member"
            })
            return
        end
        
        local data = msg.Data
        local id = msg.Tags.DataId or msg.Id
        local dataType = msg.Tags.DataType or "general"
        local source = msg.Tags.Source or "unknown"
        
        -- Validate data
        if not data or data == "" then
            msg.reply({
                Action = "PostFailed",
                Data = "[Post Failed] No data provided",
                Status = "Error",
                Message = "No data provided"
            })
            return
        end
        
        if Memory[id] then
            msg.reply({
                Action = "PostFailed",
                Data = "[Post Failed] Data ID already exists",
                Status = "Error",
                Message = "Duplicate ID"
            })
            return
        end
        
        -- Store data
        Memory[id] = {
            sender = sender,
            content = data,
            dataType = dataType,
            source = source,
            timestamp = msg.Timestamp or os.time(),
            tags = msg.Tags
        }
        
        msg.reply({
            Action = "PostSuccess",
            Data = "[Data Stored] ID: " .. id,
            Status = "Success",
            DataId = id,
            DataType = dataType
        })
        
        -- Broadcast to all members except sender
        for member_id, _ in pairs(Members) do
            if member_id ~= sender and Members[member_id].active then
                ao.send({
                    Target = member_id,
                    Action = "NewDataAvailable",
                    Data = data,
                    DataId = id,
                    DataType = dataType,
                    Source = source,
                    Sender = sender,
                    Summary = "[New Data] " .. dataType .. " data from " .. sender
                })
            end
        end
    end
)

-- Handler for listing available data
Handlers.add(
    "ListData",
    { Action = "ListData" },
    function(msg)
        local sender = msg.From
        
        -- Check membership
        if not Members[sender] or not Members[sender].active then
            msg.reply({
                Action = "AccessDenied",
                Data = "[Access Denied] Not a member.",
                Status = "Error"
            })
            return
        end
        
        local dataList = {}
        local filterType = msg.Tags.FilterType
        
        for id, entry in pairs(Memory) do
            if not filterType or entry.dataType == filterType then
                table.insert(dataList, {
                    id = id,
                    dataType = entry.dataType,
                    source = entry.source,
                    sender = entry.sender,
                    timestamp = entry.timestamp
                })
            end
        end
        
        msg.reply({
            Action = "DataList",
            Data = require('json').encode(dataList),
            Status = "Success",
            Count = tostring(#dataList),
            FilterType = filterType or "none"
        })
    end
)

-- Handler for reading specific data
Handlers.add(
    "ReadData",
    { Action = "ReadData" },
    function(msg)
        local sender = msg.From
        
        -- Check membership
        if not Members[sender] or not Members[sender].active then
            msg.reply({
                Action = "AccessDenied",
                Data = "[Access Denied] Not a member.",
                Status = "Error"
            })
            return
        end
        
        local dataId = msg.Tags.DataId or msg.Data
        local entry = Memory[dataId]
        
        if not entry then
            msg.reply({
                Action = "DataNotFound",
                Data = "[Error] Data not found.",
                Status = "Error",
                DataId = dataId
            })
            return
        end
        
        msg.reply({
            Action = "DataContent",
            Data = entry.content,
            Status = "Success",
            DataId = dataId,
            DataType = entry.dataType,
            Source = entry.source,
            Sender = entry.sender,
            Timestamp = tostring(entry.timestamp)
        })
    end
)

-- Handler for getting chatroom info
Handlers.add(
    "GetInfo",
    { Action = "GetInfo" },
    function(msg)
        local memberCount = get_member_count()
        local dataCount = get_data_count()
        
        local info = {
            accessPrice = AccessPrice,
            memberCount = memberCount,
            dataCount = dataCount,
            tokenProcess = AO_TOKEN_PROCESS
        }
        
        msg.reply({
            Action = "ChatroomInfo",
            Data = require('json').encode(info),
            Status = "Success",
            MemberCount = tostring(memberCount),
            DataCount = tostring(dataCount)
        })
    end
)

-- Handler for members to leave the chatroom
Handlers.add(
    "LeaveChatroom",
    { Action = "LeaveChatroom" },
    function(msg)
        local sender = msg.From
        
        if Members[sender] then
            Members[sender].active = false
            
            msg.reply({
                Action = "LeaveSuccess",
                Data = "[Left Chatroom] You have left the chatroom.",
                Status = "Success"
            })
            
            -- Notify other members
            for member_id, member in pairs(Members) do
                if member_id ~= sender and member.active then
                    ao.send({
                        Target = member_id,
                        Action = "MemberLeft",
                        Data = "[Member Left] " .. sender .. " left the chatroom",
                        LeftMember = sender,
                        TotalMembers = tostring(get_member_count())
                    })
                end
            end
        else
            msg.reply({
                Action = "NotMember",
                Data = "[Error] You are not a member.",
                Status = "Error"
            })
        end
    end
)

-- Handler for checking agent membership
Handlers.add(
    "CheckMembership",
    { Action = "CheckMembership" },
    function(msg)
        local agentId = msg.Tags.AgentId or msg.From
        
        if not agentId then
            msg.reply({
                Action = "MembershipStatus",
                Data = "No agent ID provided",
                Status = "Error"
            })
            return
        end
        
        local isMember = Members[agentId] and Members[agentId].active
        
        msg.reply({
            Action = "MembershipStatus", 
            Data = isMember and "Member" or "Not a member",
            Status = isMember and "Member" or "NotMember",
            AgentId = agentId,
            IsMember = isMember and "true" or "false"
        })
    end
)




