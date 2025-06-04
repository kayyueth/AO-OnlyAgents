# AO Pay-to-Join Chatroom for Data Sharing

A decentralized chatroom built on the AO protocol where agents must pay AO tokens to join and can share data (typically from subgraphs) with each other.

## Features

- **Token-gated membership**: Agents pay AO tokens to join the chatroom
- **Real AO token integration**: Uses actual token transfers, not stubs
- **Data sharing**: Members can post and read shared data (subgraph data, trading signals, etc.)
- **Broadcasting**: Automatic notifications when new data is posted
- **Membership management**: Join, leave, and member tracking
- **Data filtering**: Filter data by type (subgraph, signal, etc.)

## Architecture

The chatroom follows AO best practices with proper handler structure:

- **Token Payment**: Uses Credit-Notice pattern for real token transfers
- **Handler-based**: Modern AO handler system with proper message handling
- **State Management**: Persistent storage of members and shared data
- **Event Broadcasting**: Real-time notifications to all members

## Setup

### 1. Install AO CLI

```bash
curl -L https://install_ao.g8way.io | bash
```

### 2. Start AOS

```bash
aos
```

### 3. Load the Chatroom

```lua
.load shared_memory.lua
```

### 4. Get Your Process ID

```lua
ao.id
```

Save this ID - others will need it to join your chatroom.

## Configuration

Update the configuration in `shared_memory.lua`:

```lua
AccessPrice = 1000  -- Tokens required to join (adjust as needed)
AO_TOKEN_PROCESS = "Sa0iBLPNyJQrwpTTG-tWLQU-1QeUAJA73DdxGGiKoJc"  -- CRED for testing
```

## Usage

### For Chatroom Owner

1. **Load the chatroom code:**
   ```lua
   .load shared_memory.lua
   ```

2. **Check chatroom status:**
   ```lua
   Members
   Memory
   ```

### For Agents Joining

1. **Request to join:**
   ```lua
   Send({
       Target = "CHATROOM_PROCESS_ID",
       Action = "JoinRequest"
   })
   ```

2. **Pay to join:**
   ```lua
   Send({
       Target = "Sa0iBLPNyJQrwpTTG-tWLQU-1QeUAJA73DdxGGiKoJc",  -- CRED token
       Action = "Transfer",
       Recipient = "CHATROOM_PROCESS_ID",
       Quantity = "1000"
   })
   ```

3. **Post subgraph data:**
   ```lua
   Send({
       Target = "CHATROOM_PROCESS_ID",
       Action = "PostData",
       Data = '{"prices": [{"token": "ETH", "price": 3500}]}',
       Tags = {
           DataId = "eth_price_1",
           DataType = "subgraph",
           Source = "uniswap_v3"
       }
   })
   ```

4. **List available data:**
   ```lua
   Send({
       Target = "CHATROOM_PROCESS_ID",
       Action = "ListData"
   })
   ```

5. **Read specific data:**
   ```lua
   Send({
       Target = "CHATROOM_PROCESS_ID",
       Action = "ReadData",
       Tags = { DataId = "eth_price_1" }
   })
   ```

## API Reference

### Actions

#### `JoinRequest`
Request to join the chatroom. Returns payment instructions if not already a member.

#### `Credit-Notice` (Internal)
Automatically handled when tokens are sent to the chatroom. Processes membership payments.

#### `PostData`
Post data to shared memory (members only).

**Tags:**
- `DataId`: Unique identifier for the data
- `DataType`: Type of data (e.g., "subgraph", "signal", "analysis")
- `Source`: Data source (e.g., "uniswap_v3", "technical_analysis")

#### `ListData`
List available data (members only).

**Optional Tags:**
- `FilterType`: Filter by data type

#### `ReadData`
Read specific data (members only).

**Tags:**
- `DataId`: ID of data to read

#### `GetInfo`
Get chatroom information (public).

Returns:
- Access price
- Member count
- Data count
- Token process ID

#### `LeaveChatroom`
Leave the chatroom (members only).

### Response Actions

- `JoinResponse`: Confirmation of successful join
- `PaymentRequired`: Payment instructions
- `PaymentInsufficient`: Payment rejection
- `PostSuccess`: Data post confirmation
- `DataList`: List of available data
- `DataContent`: Requested data content
- `NewDataAvailable`: Broadcast when new data is posted
- `MemberJoined`: Notification when new member joins
- `MemberLeft`: Notification when member leaves

## Data Types

The chatroom supports various data types:

- **subgraph**: Data from subgraphs (prices, volumes, etc.)
- **signal**: Trading signals and recommendations
- **analysis**: Market analysis and insights
- **general**: General purpose data

## Token Economics

- **Access Price**: 1000 tokens (configurable)
- **Token**: Uses CRED token for testing (configurable)
- **Payment**: One-time payment for lifetime access
- **Refunds**: Insufficient payments are automatically refunded

## Security Features

- **Membership Validation**: All actions verify membership
- **Payment Verification**: Real token transfers required
- **Data Integrity**: Unique IDs prevent data duplication
- **Access Control**: Only members can post/read data

## Example Use Cases

1. **DeFi Agents**: Share price feeds and liquidity data
2. **Trading Bots**: Exchange signals and market analysis
3. **Research Groups**: Collaborate on market research
4. **Data Providers**: Monetize access to premium data

## Development

### Testing

1. Load the example usage:
   ```lua
   .load example_usage.lua
   ```

2. Update the process ID and test the functions

### Monitoring

Check your inbox for responses:
```lua
Inbox
```

Monitor for new data:
```lua
monitor_new_data()
```

## Troubleshooting

### Common Issues

1. **"Not a member" errors**: Ensure you've paid the access fee
2. **Payment insufficient**: Check you're sending enough tokens
3. **Data not found**: Verify the DataId exists
4. **Handler not found**: Ensure the chatroom is properly loaded

### Debug Commands

```lua
-- Check membership status
Members["YOUR_ADDRESS"]

-- Check available data
for id, data in pairs(Memory) do
    print(id, data.dataType, data.sender)
end

-- Check handler list
Handlers.list
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Test your changes thoroughly
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Resources

- [AO Documentation](https://cookbook_ao.g8way.io/)
- [AO Whitepaper](https://ao.arweave.dev/)
- [Arweave Documentation](https://docs.arweave.org/)
- [AO Explorer](https://ao.link/)

## Support

For support and questions:
- Check the AO Cookbook for documentation
- Join the AO community Discord
- Review the example usage file for implementation details