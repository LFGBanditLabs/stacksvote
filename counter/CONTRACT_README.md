# Voting Smart Contract - Clarity 4

A decentralized voting system built on Stacks blockchain using Clarity smart contracts.

## ✨ Clarity 4 Features Used

1. **Enhanced String Handling**: UTF-8 strings for titles and descriptions
2. **Map Merge Operations**: Efficient map updates using `merge`
3. **Improved Optional Handling**: Better `match` and `unwrap!` patterns
4. **Default Values**: Using `default-to` for voter weights

## 🎯 Contract Features

### Public Functions

#### `create-proposal`
Create a new proposal with title, description, and duration.

```clarity
(create-proposal 
  (title (string-utf8 100))
  (description (string-utf8 500))
  (duration uint)
) => (response uint uint)
```

**Parameters:**
- `title`: Proposal title (max 100 characters)
- `description`: Detailed description (max 500 characters)
- `duration`: Voting period in blocks (~10 min/block)

**Returns:** Proposal ID on success

#### `cast-vote`
Cast a weighted vote on an active proposal.

```clarity
(cast-vote 
  (proposal-id uint)
  (vote-choice bool)
) => (response bool uint)
```

**Parameters:**
- `proposal-id`: ID of the proposal to vote on
- `vote-choice`: `true` for Yes, `false` for No

**Returns:** Success boolean

**Restrictions:**
- Cannot vote twice on same proposal
- Voting must be within the active period
- Voting period must have started

#### `set-voter-weight`
Set voting weight for a user (owner only).

```clarity
(set-voter-weight 
  (voter principal)
  (weight uint)
) => (response bool uint)
```

**Parameters:**
- `voter`: Principal address of the voter
- `weight`: Voting power (default is 1)

**Access:** Contract owner only

#### `execute-proposal`
Mark a proposal as executed after voting ends.

```clarity
(execute-proposal 
  (proposal-id uint)
) => (response {...} uint)
```

**Returns:** Proposal results including pass/fail status

**Restrictions:**
- Voting period must have ended
- Cannot execute twice

### Read-Only Functions

#### `get-proposal`
Get full details of a proposal.

```clarity
(get-proposal (proposal-id uint))
```

#### `get-vote`
Get vote details for a specific voter on a proposal.

```clarity
(get-vote (proposal-id uint) (voter principal))
```

#### `get-voter-weight`
Get the voting weight of a user.

```clarity
(get-voter-weight (voter principal))
```

#### `get-proposal-count`
Get the total number of proposals created.

```clarity
(get-proposal-count)
```

#### `is-proposal-active`
Check if a proposal is currently accepting votes.

```clarity
(is-proposal-active (proposal-id uint))
```

#### `get-proposal-result`
Get vote tallies and pass/fail status.

```clarity
(get-proposal-result (proposal-id uint))
```

## 🔐 Error Codes

| Code | Constant | Description |
|------|----------|-------------|
| u100 | `err-owner-only` | Only contract owner can perform this action |
| u101 | `err-not-found` | Proposal not found |
| u102 | `err-already-voted` | User already voted on this proposal |
| u103 | `err-voting-ended` | Voting period has ended |
| u104 | `err-voting-not-ended` | Voting period still active |
| u105 | `err-unauthorized` | Unauthorized access |
| u106 | `err-invalid-duration` | Duration must be greater than 0 |
| u107 | `err-not-started` | Voting period hasn't started |
| u108 | `err-already-executed` | Proposal already executed |

## 🧪 Testing

Run the test suite:

```bash
npm install
npm test
```

Tests cover:
- ✅ Proposal creation
- ✅ Voting functionality
- ✅ Double vote prevention
- ✅ Voter weight management
- ✅ Access control
- ✅ Proposal status checks
- ✅ Result retrieval

## 🚀 Deployment

### Check Contract

```bash
clarinet check
```

### Deploy to Testnet

```bash
clarinet deploy --testnet
```

### Deploy to Mainnet

```bash
clarinet deploy --mainnet
```

## 📊 Data Structures

### Proposal Map
```clarity
{
  title: (string-utf8 100),
  description: (string-utf8 500),
  proposer: principal,
  yes-votes: uint,
  no-votes: uint,
  start-block: uint,
  end-block: uint,
  executed: bool
}
```

### Vote Map
```clarity
{
  vote: bool,
  weight: uint
}
```

## 💡 Usage Examples

### Create a Proposal
```clarity
(contract-call? .voting create-proposal 
  u"Upgrade Protocol" 
  u"Propose upgrading to version 2.0"
  u144  ;; ~1 day
)
```

### Vote on a Proposal
```clarity
(contract-call? .voting cast-vote u1 true)  ;; Vote Yes on proposal #1
```

### Check Results
```clarity
(contract-call? .voting get-proposal-result u1)
```

## 🛡️ Security Considerations

- ✅ Single vote per user per proposal
- ✅ Time-bounded voting periods
- ✅ Owner-controlled voter weights
- ✅ Immutable proposals once created
- ✅ Proper access control
- ⚠️ No vote delegation (yet)
- ⚠️ No proposal cancellation

## 📈 Gas Optimization

- Uses efficient map operations
- Minimal storage with compact data structures
- Read-only functions for queries
- Batch operations not yet implemented

## 🔄 Future Enhancements

- [ ] Proposal categories
- [ ] Quadratic voting
- [ ] Vote delegation
- [ ] Proposal amendments
- [ ] Time-locked execution
- [ ] Multi-signature proposals
- [ ] Proposal deposits/stakes

## 📝 License

MIT
