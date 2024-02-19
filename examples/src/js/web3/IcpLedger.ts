import { IDL } from '@dfinity/candid';

export const icpLedgerIdlFactory = ({ IDL: IDL }) => {
  const ApproveError = IDL.Variant({
    GenericError: IDL.Record({
      message: IDL.Text,
      error_code: IDL.Nat,
    }),
    TemporarilyUnavailable: IDL.Null,
    Duplicate: IDL.Record({ duplicate_of: IDL.Nat }),
    BadFee: IDL.Record({ expected_fee: IDL.Nat }),
    AllowanceChanged: IDL.Record({ current_allowance: IDL.Nat }),
    CreatedInFuture: IDL.Record({ ledger_time: IDL.Nat64 }),
    TooOld: IDL.Null,
    Expired: IDL.Record({ ledger_time: IDL.Nat64 }),
    InsufficientFunds: IDL.Record({ balance: IDL.Nat }),
  });
  const TransferError = IDL.Variant({
    GenericError: IDL.Record({
      message: IDL.Text,
      error_code: IDL.Nat,
    }),
    TemporarilyUnavailable: IDL.Null,
    BadBurn: IDL.Record({ min_burn_amount: IDL.Nat }),
    Duplicate: IDL.Record({ duplicate_of: IDL.Nat }),
    BadFee: IDL.Record({ expected_fee: IDL.Nat }),
    CreatedInFuture: IDL.Record({ ledger_time: IDL.Nat64 }),
    TooOld: IDL.Null,
    InsufficientFunds: IDL.Record({ balance: IDL.Nat }),
  });
  const TransferFromError = IDL.Variant({
    GenericError: IDL.Record({
      message: IDL.Text,
      error_code: IDL.Nat,
    }),
    TemporarilyUnavailable: IDL.Null,
    InsufficientAllowance: IDL.Record({ allowance: IDL.Nat }),
    BadBurn: IDL.Record({ min_burn_amount: IDL.Nat }),
    Duplicate: IDL.Record({ duplicate_of: IDL.Nat }),
    BadFee: IDL.Record({ expected_fee: IDL.Nat }),
    CreatedInFuture: IDL.Record({ ledger_time: IDL.Nat64 }),
    TooOld: IDL.Null,
    InsufficientFunds: IDL.Record({ balance: IDL.Nat }),
  });
  const Account = IDL.Record({
    owner: IDL.Principal,
    subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
  });
  const MetadataValue = IDL.Variant({
    Int: IDL.Int,
    Nat: IDL.Nat,
    Blob: IDL.Vec(IDL.Nat8),
    Text: IDL.Text,
  });
  const TokenExtension = IDL.Record({ url: IDL.Text, name: IDL.Text });
  const TransferArg = IDL.Record({
    to: Account,
    fee: IDL.Opt(IDL.Nat),
    memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
    from_subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
    created_at_time: IDL.Opt(IDL.Nat64),
    amount: IDL.Nat,
  });
  const Result_5 = IDL.Variant({ Ok: IDL.Nat, Err: TransferError });
  const AllowanceArgs = IDL.Record({
    account: Account,
    spender: Account,
  });
  const Allowance = IDL.Record({
    allowance: IDL.Nat,
    expires_at: IDL.Opt(IDL.Nat64),
  });
  const ApproveArgs = IDL.Record({
    fee: IDL.Opt(IDL.Nat),
    memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
    from_subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
    created_at_time: IDL.Opt(IDL.Nat64),
    amount: IDL.Nat,
    expected_allowance: IDL.Opt(IDL.Nat),
    expires_at: IDL.Opt(IDL.Nat64),
    spender: Account,
  });
  const Result_6 = IDL.Variant({ Ok: IDL.Nat, Err: ApproveError });
  const TransferFromArgs = IDL.Record({
    to: Account,
    fee: IDL.Opt(IDL.Nat),
    spender_subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
    from: Account,
    memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
    created_at_time: IDL.Opt(IDL.Nat64),
    amount: IDL.Nat,
  });
  const Result_7 = IDL.Variant({ Ok: IDL.Nat, Err: TransferFromError });
  return IDL.Service({
    icrc1_balance_of: IDL.Func([Account], [IDL.Nat], ['query']),
    icrc1_decimals: IDL.Func([], [IDL.Nat8], ['query']),
    icrc1_fee: IDL.Func([], [IDL.Nat], ['query']),
    icrc1_metadata: IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(IDL.Text, MetadataValue))],
      ['query'],
    ),
    icrc1_name: IDL.Func([], [IDL.Text], ['query']),
    icrc1_supported_standards: IDL.Func(
      [],
      [IDL.Vec(TokenExtension)],
      ['query'],
    ),
    icrc1_symbol: IDL.Func([], [IDL.Text], ['query']),
    icrc1_total_supply: IDL.Func([], [IDL.Nat], ['query']),
    icrc1_transfer: IDL.Func([TransferArg], [Result_5], []),
    icrc2_allowance: IDL.Func([AllowanceArgs], [Allowance], ['query']),
    icrc2_approve: IDL.Func([ApproveArgs], [Result_6], []),
    icrc2_transfer_from: IDL.Func([TransferFromArgs], [Result_7], []),
  });
};
