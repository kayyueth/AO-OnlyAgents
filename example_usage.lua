-- Example Usage: AO Pay-to-Join Chatroom
-- This file demonstrates how to interact with the chatroom

-- First, load the chatroom process
-- .load shared_memory.lua

-- Configuration
CHATROOM_PROCESS = "YOUR_CHATROOM_PROCESS_ID"  -- Replace with actual process ID
CRED_PROCESS = "Sa0iBLPNyJQrwpTTG-tWLQU-1QeUAJA73DdxGGiKoJc"  -- CRED token process

-- 1. Check chatroom info
Send({
    Target = CHATROOM_PROCESS,
    Action = "GetInfo"
})

-- 2. Request to join the chatroom
Send({
    Target = CHATROOM_PROCESS,
    Action = "JoinRequest"
})

-- 3. Pay to join (send tokens to the chatroom)
-- This will trigger a Credit-Notice to the chatroom when tokens are received
Send({
    Target = CRED_PROCESS,
    Action = "Transfer",
    Recipient = CHATROOM_PROCESS,
    Quantity = "1000"  -- Must be >= AccessPrice
})

-- 4. Post subgraph data to the chatroom
Send({
    Target = CHATROOM_PROCESS,
    Action = "PostData",
    Data = '{"prices": [{"token": "ETH", "price": 3500, "timestamp": 1640995200}], "volumes": [{"token": "ETH", "volume": 1000000}]}',
    DataId = "eth_price_data_1",
    DataType = "subgraph",
    Source = "uniswap_v3"
})

-- 5. Post trading signal data
Send({
    Target = CHATROOM_PROCESS,
    Action = "PostData",
    Data = '{"signal": "BUY", "token": "ETH", "confidence": 0.85, "reason": "bullish divergence"}',
    DataId = "trading_signal_1",
    DataType = "signal",
    Source = "technical_analysis"
})

-- 6. List all available data
Send({
    Target = CHATROOM_PROCESS,
    Action = "ListData"
})

-- 7. List only subgraph data
Send({
    Target = CHATROOM_PROCESS,
    Action = "ListData",
    FilterType = "subgraph"
})

-- 8. Read specific data
Send({
    Target = CHATROOM_PROCESS,
    Action = "ReadData",
    DataId = "eth_price_data_1"
})

-- 9. Leave the chatroom (optional)
Send({
    Target = CHATROOM_PROCESS,
    Action = "LeaveChatroom"
})

-- Helper function to check your messages/inbox
function check_inbox()
    return Inbox
end

-- Helper function to get the latest message
function get_latest_message()
    if #Inbox > 0 then
        return Inbox[#Inbox]
    end
    return nil
end

-- Helper function to get messages by action
function get_messages_by_action(action)
    local messages = {}
    for _, msg in ipairs(Inbox) do
        if msg.Action == action then
            table.insert(messages, msg)
        end
    end
    return messages
end

-- Example of monitoring for new data notifications
function monitor_new_data()
    local new_data_messages = get_messages_by_action("NewDataAvailable")
    for _, msg in ipairs(new_data_messages) do
        print("New data available: " .. (msg.DataType or "unknown") .. " from " .. (msg.Sender or "unknown"))
        print("Data ID: " .. (msg.DataId or "unknown"))
    end
end

-- Example of checking join status
function check_join_status()
    local join_messages = get_messages_by_action("JoinResponse")
    local payment_messages = get_messages_by_action("PaymentRequired")
    
    for _, msg in ipairs(payment_messages) do
        print("Payment required: " .. (msg.Data or ""))
        print("Amount needed: " .. (msg.Amount or "unknown"))
    end
    
    for _, msg in ipairs(join_messages) do
        print("Join status: " .. (msg.Data or ""))
        print("Status: " .. (msg.Status or "unknown"))
    end
end

-- Example of checking posted data responses
function check_post_responses()
    local success_messages = get_messages_by_action("PostSuccess")
    local failed_messages = get_messages_by_action("PostFailed")
    
    for _, msg in ipairs(success_messages) do
        print("Successfully posted: " .. (msg.DataId or "unknown"))
    end
    
    for _, msg in ipairs(failed_messages) do
        print("Failed to post: " .. (msg.Data or ""))
    end
end

-- Print usage instructions
print("=== AO Pay-to-Join Chatroom Usage ===")
print("1. Update CHATROOM_PROCESS with your process ID")
print("2. Run: .load example_usage.lua")
print("3. Check the examples above to interact with the chatroom")
print("4. Use check_inbox() to see received messages")
print("5. Use monitor_new_data() to check for new data notifications")
print("6. Use check_join_status() to verify your membership")
print("7. Use check_post_responses() to see if your data was posted successfully") 