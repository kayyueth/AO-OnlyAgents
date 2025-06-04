-- shared_memory_agent.lua
-- Blueprint: Shared Memory Agent for AO

Memory = {}

receive = function(message)
  if message.Type == "memory_update" then
    local key = message.Key or ""
    local value = message.Value or ""
    local sender = message.From or "unknown"

    -- Optional: token-gating or address whitelist
    if not Allowed or Allowed[sender] then
      Memory[key] = {
        value = value,
        timestamp = os.time(),
        updated_by = sender
      }
      output = "[Memory Updated] " .. key .. " = " .. value
    else
      output = "[Rejected] Unauthorized sender: " .. sender
    end

  elseif message.Type == "query" then
    local key = message.Key or ""
    local entry = Memory[key]
    local value = entry and entry.value or "null"
    Send({
      Target = message.From,
      Type = "response",
      Key = key,
      Value = value
    })
    output = "[Responded] " .. key .. " = " .. value

  elseif message.Type == "list_keys" then
    local keys = {}
    for k, _ in pairs(Memory) do table.insert(keys, k) end
    Send({
      Target = message.From,
      Type = "keys",
      Keys = keys
    })
    output = "[Keys Sent]"
  end
end

-- Optional: preload a whitelist of allowed agents
Allowed = {
  -- ["process_id"] = true
}
