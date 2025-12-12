# Contributing to StacksVote

First off, thank you for considering contributing to StacksVote! 🎉

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if relevant**
- **Note your environment** (OS, browser, wallet version)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **List any similar features in other projects**

### Pull Requests

1. **Fork the repo** and create your branch from `main`
2. **Make your changes** with clear, concise commits
3. **Test your changes** thoroughly
4. **Update documentation** if needed
5. **Ensure tests pass** (if applicable)
6. **Submit your PR** with a clear description

## Development Setup

### Smart Contract Development

```bash
cd counter
clarinet check
clarinet test
```

### Frontend Development

```bash
cd voting-frontend
npm install
npm run dev
```

## Code Style

### Clarity Smart Contracts
- Use kebab-case for function and variable names
- Add comments for complex logic
- Follow Clarity best practices

### TypeScript/React
- Use TypeScript for type safety
- Follow React hooks best practices
- Use functional components
- Keep components focused and reusable

### Commit Messages

Follow conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Example: `feat: add proposal filtering by status`

## Testing

- Test smart contract functions with Clarinet
- Test frontend components manually
- Ensure wallet integration works with test transactions
- Verify responsive design on multiple devices

## Questions?

Feel free to open an issue with your question or reach out to the maintainers!

Thank you for contributing! 🚀
