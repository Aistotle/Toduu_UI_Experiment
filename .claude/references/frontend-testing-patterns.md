# Frontend Testing Patterns

Patterns for writing Vitest + React Testing Library tests in this codebase.

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| Vitest | Test runner |
| React Testing Library | Component testing |
| @testing-library/user-event | User interaction simulation |
| MSW (if needed) | API mocking |

---

## File Conventions

- Test files: `ComponentName.test.tsx` (co-located with component)
- Or: `ComponentName.spec.tsx` (same thing)
- Integration tests: `src/features/*/tests/`

---

## Test Structure Template

```tsx
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ComponentName } from './ComponentName'

// Mock external dependencies only
vi.mock('@/lib/api/secureFetch')
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/test',
}))

describe('ComponentName', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // REQUIRED: Rendering
  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(<ComponentName />)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })
  })

  // REQUIRED: Props
  describe('Props', () => {
    it('should apply custom className', () => {
      render(<ComponentName className="custom" />)
      expect(screen.getByRole('button')).toHaveClass('custom')
    })
  })

  // REQUIRED: Edge Cases
  describe('Edge Cases', () => {
    it('should handle null data gracefully', () => {
      render(<ComponentName data={null} />)
      expect(screen.queryByRole('list')).not.toBeInTheDocument()
    })

    it('should handle empty array', () => {
      render(<ComponentName items={[]} />)
      expect(screen.getByText(/no items/i)).toBeInTheDocument()
    })
  })

  // CONDITIONAL: User Interactions
  describe('User Interactions', () => {
    it('should call onClick when button is clicked', async () => {
      const user = userEvent.setup()
      const handleClick = vi.fn()

      render(<ComponentName onClick={handleClick} />)
      await user.click(screen.getByRole('button'))

      expect(handleClick).toHaveBeenCalledTimes(1)
    })
  })

  // CONDITIONAL: Async/API
  describe('Async Operations', () => {
    it('should show loading state while fetching', async () => {
      render(<ComponentName />)

      expect(screen.getByRole('status')).toBeInTheDocument()

      await waitFor(() => {
        expect(screen.queryByRole('status')).not.toBeInTheDocument()
      })
    })
  })
})
```

---

## Required Test Scenarios

### Always Required (Every Component)

| Category | What to Test |
|----------|--------------|
| Rendering | Renders without crashing |
| Props | Required props work, optional props have defaults |
| Edge Cases | null, undefined, empty arrays, boundary values |

### Conditional (When Feature Exists)

| Feature | Test Focus |
|---------|------------|
| `useState` | Initial state, state transitions |
| `useEffect` | Effect runs, cleanup works |
| Event handlers | onClick, onChange, onSubmit |
| API calls | Loading, success, error states |
| Forms | Validation, submission, error display |
| Conditional rendering | All branches covered |

---

## Testing Order (Complexity-Based)

When testing a directory, process in this order:

1. **Utility functions** — Pure functions, no React
2. **Custom hooks** — `use*.ts` files
3. **Simple components** — Presentational, no state
4. **Medium components** — State, effects, no API
5. **Complex components** — API calls, routing, context
6. **Integration tests** — Index files, full flows

**Rule**: Complete and verify each file before moving to the next.

---

## Incremental Workflow

**NEVER generate all test files at once.**

```
For each file:
1. Write test file
2. Run: pnpm test -- path/to/file.test.tsx
3. PASS? → Next file
   FAIL? → Fix first, then continue
```

---

## What to Mock vs Import Real

### Mock These
- API services (`@/lib/api/*`, `secureFetch`)
- `next/navigation` (useRouter, usePathname)
- External services (Supabase client, analytics)
- Heavy context providers

### Don't Mock These
- Child components in same feature
- UI components (`@/components/ui/*`)
- Utility functions
- Zustand stores (test with real store)

---

## Query Priority

Use queries in this order (most to least preferred):

1. `getByRole` — Accessible, semantic
2. `getByLabelText` — Form inputs
3. `getByPlaceholderText` — Inputs without labels
4. `getByText` — Non-interactive content
5. `getByTestId` — Last resort only

```tsx
// Preferred
screen.getByRole('button', { name: /submit/i })

// Acceptable
screen.getByText(/loading/i)

// Avoid unless necessary
screen.getByTestId('submit-button')
```

---

## Async Testing Patterns

### Waiting for Elements
```tsx
// Wait for element to appear
await waitFor(() => {
  expect(screen.getByText('Success')).toBeInTheDocument()
})

// Wait for element to disappear
await waitFor(() => {
  expect(screen.queryByText('Loading')).not.toBeInTheDocument()
})
```

### User Events (Preferred over fireEvent)
```tsx
const user = userEvent.setup()

// Click
await user.click(screen.getByRole('button'))

// Type
await user.type(screen.getByRole('textbox'), 'hello')

// Clear and type
await user.clear(screen.getByRole('textbox'))
await user.type(screen.getByRole('textbox'), 'new value')

// Select
await user.selectOptions(screen.getByRole('combobox'), 'option1')
```

---

## Coverage Goals

Per file:
- 100% function coverage
- 100% statement coverage
- >90% branch coverage
- >90% line coverage

Check coverage:
```bash
pnpm test -- --coverage path/to/file.test.tsx
```

---

## Naming Convention

Pattern: `should <behavior> when <condition>`

```tsx
// Good
it('should disable button when form is invalid')
it('should show error message when API fails')
it('should call onSubmit with form data when submitted')

// Bad
it('button test')
it('works correctly')
it('handles the thing')
```

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Testing implementation details | Test behavior only |
| Hardcoded text assertions | Use regex: `/loading/i` |
| Multiple behaviors per test | One `expect` focus per test |
| Not waiting for async | Use `waitFor` or `findBy` |
| Mocking everything | Only mock external deps |
| `fireEvent` for user actions | Use `userEvent` instead |
