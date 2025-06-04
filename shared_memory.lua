-- shared_memory_agent.lua
-- Blueprint: Shared Memory Agent for AO (AO-native semantics)

Memory = {}

receive = function(message)
  local sender = message.From or "unknown"
  local action = message.Action or ""
  local data = message.Data or {}

  if action == "Update" then
    for key, value in pairs(data) do
      if not Allowed or Allowed[sender] then
        Memory[key] = {
          value = value,
          timestamp = os.time(),
          updated_by = sender
        }
        output = "[Memory Updated] " .. key .. " = " .. tostring(value)
      else
        output = "[Rejected] Unauthorized sender: " .. sender
      end
    end

  elseif action == "Query" then
    local key = tostring(data)
    local entry = Memory[key]
    local value = entry and entry.value or "null"
    Send({
      Target = sender,
      Action = "Reply",
      Data = {
        [key] = value
      }
    })
    output = "[Responded] " .. key .. " = " .. value

  elseif action == "ListKeys" then
    local keys = {}
    for k, _ in pairs(Memory) do table.insert(keys, k) end
    Send({
      Target = sender,
      Action = "Keys",
      Data = keys
    })
    output = "[Keys Sent]"
  end
end

-- Optional: preload a whitelist of allowed agents
Allowed = {
  -- ["process_id"] = true
}
