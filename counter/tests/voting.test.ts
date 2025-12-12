import { describe, expect, it } from "vitest";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;

describe("Voting Contract Tests", () => {
  
  it("should create a new proposal", () => {
    const { result } = simnet.callPublicFn(
      "voting",
      "create-proposal",
      [
        Cl.stringUtf8("Test Proposal"),
        Cl.stringUtf8("This is a test proposal description"),
        Cl.uint(144) // 1 day in blocks
      ],
      deployer
    );
    expect(result).toBeOk(Cl.uint(1));
  });

  it("should get proposal count", () => {
    simnet.callPublicFn(
      "voting",
      "create-proposal",
      [
        Cl.stringUtf8("Proposal 1"),
        Cl.stringUtf8("Description 1"),
        Cl.uint(144)
      ],
      deployer
    );

    const { result } = simnet.callReadOnly(
      "voting",
      "get-proposal-count",
      [],
      deployer
    );
    expect(result).toBeOk(Cl.uint(1));
  });

  it("should allow voting on a proposal", () => {
    // Create proposal
    simnet.callPublicFn(
      "voting",
      "create-proposal",
      [
        Cl.stringUtf8("Vote Test"),
        Cl.stringUtf8("Test voting functionality"),
        Cl.uint(144)
      ],
      deployer
    );

    // Vote yes
    const { result } = simnet.callPublicFn(
      "voting",
      "cast-vote",
      [Cl.uint(1), Cl.bool(true)],
      wallet1
    );
    expect(result).toBeOk(Cl.bool(true));
  });

  it("should prevent double voting", () => {
    // Create proposal
    simnet.callPublicFn(
      "voting",
      "create-proposal",
      [
        Cl.stringUtf8("Double Vote Test"),
        Cl.stringUtf8("Test double voting prevention"),
        Cl.uint(144)
      ],
      deployer
    );

    // First vote
    simnet.callPublicFn(
      "voting",
      "cast-vote",
      [Cl.uint(1), Cl.bool(true)],
      wallet1
    );

    // Second vote (should fail)
    const { result } = simnet.callPublicFn(
      "voting",
      "cast-vote",
      [Cl.uint(1), Cl.bool(false)],
      wallet1
    );
    expect(result).toBeErr(Cl.uint(102)); // err-already-voted
  });

  it("should set voter weight (owner only)", () => {
    const { result } = simnet.callPublicFn(
      "voting",
      "set-voter-weight",
      [Cl.principal(wallet1), Cl.uint(5)],
      deployer
    );
    expect(result).toBeOk(Cl.bool(true));
  });

  it("should reject voter weight change from non-owner", () => {
    const { result } = simnet.callPublicFn(
      "voting",
      "set-voter-weight",
      [Cl.principal(wallet2), Cl.uint(5)],
      wallet1
    );
    expect(result).toBeErr(Cl.uint(100)); // err-owner-only
  });

  it("should get proposal details", () => {
    simnet.callPublicFn(
      "voting",
      "create-proposal",
      [
        Cl.stringUtf8("Details Test"),
        Cl.stringUtf8("Test proposal details retrieval"),
        Cl.uint(144)
      ],
      deployer
    );

    const { result } = simnet.callReadOnly(
      "voting",
      "get-proposal",
      [Cl.uint(1)],
      deployer
    );
    expect(result).toBeOk(Cl.some(
      Cl.tuple({
        title: Cl.stringUtf8("Details Test"),
        description: Cl.stringUtf8("Test proposal details retrieval"),
        proposer: Cl.principal(deployer),
        "yes-votes": Cl.uint(0),
        "no-votes": Cl.uint(0),
        "start-block": Cl.uint(simnet.blockHeight),
        "end-block": Cl.uint(simnet.blockHeight + 144),
        executed: Cl.bool(false)
      })
    ));
  });

  it("should check if proposal is active", () => {
    simnet.callPublicFn(
      "voting",
      "create-proposal",
      [
        Cl.stringUtf8("Active Test"),
        Cl.stringUtf8("Test active status"),
        Cl.uint(144)
      ],
      deployer
    );

    const { result } = simnet.callReadOnly(
      "voting",
      "is-proposal-active",
      [Cl.uint(1)],
      deployer
    );
    expect(result).toBeOk(Cl.bool(true));
  });

  it("should get proposal results", () => {
    // Create proposal
    simnet.callPublicFn(
      "voting",
      "create-proposal",
      [
        Cl.stringUtf8("Results Test"),
        Cl.stringUtf8("Test results retrieval"),
        Cl.uint(144)
      ],
      deployer
    );

    // Cast votes
    simnet.callPublicFn("voting", "cast-vote", [Cl.uint(1), Cl.bool(true)], wallet1);
    simnet.callPublicFn("voting", "cast-vote", [Cl.uint(1), Cl.bool(false)], wallet2);

    const { result } = simnet.callReadOnly(
      "voting",
      "get-proposal-result",
      [Cl.uint(1)],
      deployer
    );
    
    expect(result).toBeOk(Cl.tuple({
      "yes-votes": Cl.uint(1),
      "no-votes": Cl.uint(1),
      "total-votes": Cl.uint(2),
      passed: Cl.bool(false),
      executed: Cl.bool(false)
    }));
  });
});
