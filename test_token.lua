-- Simple Test Token for AO Chatroom Testing
-- This token allows unlimited minting for testing purposes

-- Token state
local json = require('json')

-- Token info
Name = "Test Token"
Ticker = "TEST"
Denomination = 12
TotalSupply = 0
Balances = Balances or {}

-- Initialize balance for owner
if not Balances[ao.id] then
    Balances[ao.id] = 0
end

-- Utility functions
local function mint(target, quantity)
    local qty = tonumber(quantity)
    if not qty or qty <= 0 then
        return false, "Invalid quantity"
    end
    
    Balances[target] = (Balances[target] or 0) + qty
    TotalSupply = TotalSupply + qty
    return true, "Minted successfully"
end

local function transfer(from, to, quantity)
    local qty = tonumber(quantity)
    if not qty or qty <= 0 then
        return false, "Invalid quantity"
    end
    
    local fromBalance = Balances[from] or 0
    if fromBalance < qty then
        return false, "Insufficient balance"
    end
    
    Balances[from] = fromBalance - qty
    Balances[to] = (Balances[to] or 0) + qty
    
    return true, "Transfer successful"
end

-- Handler for minting tokens (for testing)
Handlers.add(
    "Mint",
    { Action = "Mint" },
    function(msg)
        local target = msg.From
        local quantity = msg.Tags.Quantity or "1000"
        
        local success, message = mint(target, quantity)
        
        if success then
            msg.reply({
                Action = "Mint-Success",
                Data = "Minted " .. quantity .. " tokens to " .. target,
                Balance = tostring(Balances[target])
            })
        else
            msg.reply({
                Action = "Mint-Error",
                Data = message
            })
        end
    end
)

-- Handler for balance queries
Handlers.add(
    "Balance",
    { Action = "Balance" },
    function(msg)
        local target = msg.Tags.Target or msg.From
        local balance = Balances[target] or 0
        
        msg.reply({
            Data = tostring(balance),
            Balance = tostring(balance),
            Target = target
        })
    end
)

-- Handler for transfers
Handlers.add(
    "Transfer",
    { Action = "Transfer" },
    function(msg)
        local from = msg.From
        local to = msg.Tags.Recipient
        local quantity = msg.Tags.Quantity
        
        if not to then
            msg.reply({
                Action = "Transfer-Error",
                Data = "No recipient specified"
            })
            return
        end
        
        local success, message = transfer(from, to, quantity)
        
        if success then
            msg.reply({
                Action = "Transfer-Success",
                Data = "Transferred " .. quantity .. " tokens to " .. to
            })
            
            -- Send Credit-Notice to recipient
            ao.send({
                Target = to,
                Action = "Credit-Notice",
                Data = "Received " .. quantity .. " tokens from " .. from,
                Tags = {
                    From = from,
                    Quantity = quantity
                }
            })
        else
            msg.reply({
                Action = "Transfer-Error",
                Data = message
            })
        end
    end
)

-- Handler for token info
Handlers.add(
    "Info",
    { Action = "Info" },
    function(msg)
        msg.reply({
            Action = "Info-Response",
            Data = json.encode({
                Name = Name,
                Ticker = Ticker,
                Denomination = Denomination,
                TotalSupply = TotalSupply
            }),
            Name = Name,
            Ticker = Ticker,
            TotalSupply = tostring(TotalSupply)
        })
    end
)

-- Faucet for easy testing
Handlers.add(
    "Faucet",
    { Action = "Faucet" },
    function(msg)
        local target = msg.From
        local faucetAmount = "10000"  -- Give 10k tokens from faucet
        
        local success, message = mint(target, faucetAmount)
        
        if success then
            msg.reply({
                Action = "Faucet-Success",
                Data = "Faucet gave you " .. faucetAmount .. " tokens!",
                Balance = tostring(Balances[target])
            })
        else
            msg.reply({
                Action = "Faucet-Error",
                Data = message
            })
        end
    end
) 