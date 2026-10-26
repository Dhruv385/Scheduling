---
paths:
  - "src/bank-account/bank-account.schema.ts"
  - "src/bank-account/dto/dto.createAccount.ts"
  - "src/bank-account/bank-account.service.ts"
  - "src/bank-account/back-account.service.ts"
  - "src/scheduling/scheduling.service.ts"
  - "src/email/email.service.ts"
---

# Bank account fields must stay in sync

The account fields (`name`, `email`, `balance`, `phoneNo`) are defined in several places that must agree. Adding, removing, renaming or retyping a field means updating all of them:

1. **Mongoose schema**: `src/bank-account/bank-account.schema.ts` (`Bank` class `@Prop`s; `email` is unique)
2. **Create DTO**: `src/bank-account/dto/dto.createAccount.ts` (`CreateDTO` class-validator decorators must match the schema's type and `required`)
3. **Account services**: `createAccount()` in `src/bank-account/bank-account.service.ts` and in the duplicate `src/bank-account/back-account.service.ts`, which map DTO → document. Keep both identical or delete the unused `BackAccountService`.
4. **Scheduler**: `src/scheduling/scheduling.service.ts` projects `{ email: 1, balance: 1 }` and reads `user.email` / `user.balance`
5. **Email**: `EmailService.sendEmail(email, balance)` in `src/email/email.service.ts`

Invariants:
- `email` is always stored trimmed and lowercased; every lookup must normalize the same way.
- `balance` is a number rounded to 2 decimals (`toFixed(2)`) on every write.
- The `Bank` model is registered in both `BankModule` and `SchedulerModule` with the same `BankSchema`. Changes to its name or collection (`Banks`) must update both.
