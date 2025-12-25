;; Voting Smart Contract using Clarity 4 Features
;; This contract implements a decentralized voting system with proposal creation and voting
;; Version: 2.0.0 - Enhanced with delegation, revote, cancellation, and quorum

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-found (err u101))
(define-constant err-already-voted (err u102))
(define-constant err-voting-ended (err u103))
(define-constant err-voting-not-ended (err u104))
(define-constant err-unauthorized (err u105))
(define-constant err-invalid-duration (err u106))
(define-constant err-not-started (err u107))
(define-constant err-already-executed (err u108))
(define-constant err-cannot-delegate-to-self (err u109))
(define-constant err-quorum-not-met (err u110))
(define-constant err-already-cancelled (err u111))
(define-constant err-cannot-cancel (err u112))

;; Data Variables
(define-data-var proposal-counter uint u0)
(define-data-var minimum-quorum uint u10) ;; Minimum votes required for proposal to pass

;; Data Maps
(define-map proposals
    uint
    {
        title: (string-utf8 100),
        description: (string-utf8 500),
        proposer: principal,
        yes-votes: uint,
        no-votes: uint,
        start-block: uint,
        end-block: uint,
        executed: bool,
        cancelled: bool
    }
)

(define-map votes
    {proposal-id: uint, voter: principal}
    {vote: bool, weight: uint}
)

(define-map voter-weights
    principal
    uint
)

;; Delegation map - maps delegator to their delegate
(define-map delegations
    principal
    principal
)

;; Public Functions

;; Create a new proposal (Clarity 4: improved string handling)
(define-public (create-proposal (title (string-utf8 100)) (description (string-utf8 500)) (duration uint))
    (let
        (
            (proposal-id (+ (var-get proposal-counter) u1))
            (start-block stacks-block-height)
            (end-block (+ stacks-block-height duration))
        )
        (asserts! (> duration u0) err-invalid-duration)
        (map-set proposals proposal-id {
            title: title,
            description: description,
            proposer: tx-sender,
            yes-votes: u0,
            no-votes: u0,
            start-block: start-block,
            end-block: end-block,
            executed: false,
            cancelled: false
        })
        (var-set proposal-counter proposal-id)
        (ok proposal-id)
    )
)

;; Cast vote on a proposal (Clarity 4: enhanced map operations)
(define-public (cast-vote (proposal-id uint) (vote-choice bool))
    (let
        (
            (proposal (unwrap! (map-get? proposals proposal-id) err-not-found))
            (voter-weight (default-to u1 (map-get? voter-weights tx-sender)))
            (has-voted (is-some (map-get? votes {proposal-id: proposal-id, voter: tx-sender})))
        )
        ;; Check if already voted
        (asserts! (not has-voted) err-already-voted)
        
        ;; Check if proposal is cancelled
        (asserts! (not (get cancelled proposal)) err-already-cancelled)
        
        ;; Check if voting is still active
        (asserts! (<= stacks-block-height (get end-block proposal)) err-voting-ended)
        (asserts! (>= stacks-block-height (get start-block proposal)) err-not-started)
        
        ;; Record the vote
        (map-set votes 
            {proposal-id: proposal-id, voter: tx-sender}
            {vote: vote-choice, weight: voter-weight}
        )
        
        ;; Update vote counts using merge (Clarity 4 feature)
        (if vote-choice
            (map-set proposals proposal-id 
                (merge proposal {yes-votes: (+ (get yes-votes proposal) voter-weight)})
            )
            (map-set proposals proposal-id 
                (merge proposal {no-votes: (+ (get no-votes proposal) voter-weight)})
            )
        )
        (ok true)
    )
)

;; Change vote on a proposal (new feature)
(define-public (change-vote (proposal-id uint) (new-vote-choice bool))
    (let
        (
            (proposal (unwrap! (map-get? proposals proposal-id) err-not-found))
            (voter-weight (default-to u1 (map-get? voter-weights tx-sender)))
            (previous-vote (unwrap! (map-get? votes {proposal-id: proposal-id, voter: tx-sender}) err-not-found))
            (old-vote-choice (get vote previous-vote))
        )
        ;; Check if proposal is cancelled
        (asserts! (not (get cancelled proposal)) err-already-cancelled)
        
        ;; Check if voting is still active
        (asserts! (<= stacks-block-height (get end-block proposal)) err-voting-ended)
        (asserts! (>= stacks-block-height (get start-block proposal)) err-not-started)
        
        ;; Update the vote
        (map-set votes 
            {proposal-id: proposal-id, voter: tx-sender}
            {vote: new-vote-choice, weight: voter-weight}
        )
        
        ;; Adjust vote counts - remove old vote, add new vote
        (let
            (
                (updated-proposal
                    (if old-vote-choice
                        ;; Was yes, now no
                        (if new-vote-choice
                            proposal  ;; No change if both yes
                            (merge proposal {
                                yes-votes: (- (get yes-votes proposal) voter-weight),
                                no-votes: (+ (get no-votes proposal) voter-weight)
                            })
                        )
                        ;; Was no, now yes
                        (if new-vote-choice
                            (merge proposal {
                                yes-votes: (+ (get yes-votes proposal) voter-weight),
                                no-votes: (- (get no-votes proposal) voter-weight)
                            })
                            proposal  ;; No change if both no
                        )
                    )
                )
            )
            (map-set proposals proposal-id updated-proposal)
            (ok true)
        )
    )
)

;; Delegate voting power to another address (new feature)
(define-public (delegate-vote (delegate-to principal))
    (begin
        ;; Cannot delegate to yourself
        (asserts! (not (is-eq tx-sender delegate-to)) err-cannot-delegate-to-self)
        
        ;; Set delegation
        (ok (map-set delegations tx-sender delegate-to))
    )
)

;; Remove delegation (new feature)
(define-public (remove-delegation)
    (ok (map-delete delegations tx-sender))
)

;; Vote with delegated power (new feature)
(define-public (vote-with-delegation (proposal-id uint) (vote-choice bool) (delegator principal))
    (let
        (
            (proposal (unwrap! (map-get? proposals proposal-id) err-not-found))
            (delegate (unwrap! (map-get? delegations delegator) err-unauthorized))
            (voter-weight (default-to u1 (map-get? voter-weights delegator)))
            (has-voted (is-some (map-get? votes {proposal-id: proposal-id, voter: delegator})))
        )
        ;; Check if sender is the delegate
        (asserts! (is-eq tx-sender delegate) err-unauthorized)
        
        ;; Check if already voted
        (asserts! (not has-voted) err-already-voted)
        
        ;; Check if proposal is cancelled
        (asserts! (not (get cancelled proposal)) err-already-cancelled)
        
        ;; Check if voting is still active
        (asserts! (<= stacks-block-height (get end-block proposal)) err-voting-ended)
        (asserts! (>= stacks-block-height (get start-block proposal)) err-not-started)
        
        ;; Record the vote for the delegator
        (map-set votes 
            {proposal-id: proposal-id, voter: delegator}
            {vote: vote-choice, weight: voter-weight}
        )
        
        ;; Update vote counts
        (if vote-choice
            (map-set proposals proposal-id 
                (merge proposal {yes-votes: (+ (get yes-votes proposal) voter-weight)})
            )
            (map-set proposals proposal-id 
                (merge proposal {no-votes: (+ (get no-votes proposal) voter-weight)})
            )
        )
        (ok true)
    )
)

;; Cancel proposal (only by proposer or owner, new feature)
(define-public (cancel-proposal (proposal-id uint))
    (let
        (
            (proposal (unwrap! (map-get? proposals proposal-id) err-not-found))
        )
        ;; Only proposer or contract owner can cancel
        (asserts! (or 
            (is-eq tx-sender (get proposer proposal))
            (is-eq tx-sender contract-owner)
        ) err-cannot-cancel)
        
        ;; Cannot cancel if already executed
        (asserts! (not (get executed proposal)) err-already-executed)
        
        ;; Cannot cancel if already cancelled
        (asserts! (not (get cancelled proposal)) err-already-cancelled)
        
        ;; Mark as cancelled
        (map-set proposals proposal-id (merge proposal {cancelled: true}))
        (ok true)
    )
)

;; Set voter weight (only contract owner)
(define-public (set-voter-weight (voter principal) (weight uint))
    (begin
        (asserts! (is-eq tx-sender contract-owner) err-owner-only)
        (ok (map-set voter-weights voter weight))
    )
)

;; Set minimum quorum (only contract owner, new feature)
(define-public (set-minimum-quorum (new-quorum uint))
    (begin
        (asserts! (is-eq tx-sender contract-owner) err-owner-only)
        (ok (var-set minimum-quorum new-quorum))
    )
)

;; Execute proposal (mark as executed after voting ends)
(define-public (execute-proposal (proposal-id uint))
    (let
        (
            (proposal (unwrap! (map-get? proposals proposal-id) err-not-found))
            (total-votes (+ (get yes-votes proposal) (get no-votes proposal)))
        )
        ;; Check if voting has ended
        (asserts! (> stacks-block-height (get end-block proposal)) err-voting-not-ended)
        
        ;; Check if not already executed
        (asserts! (not (get executed proposal)) err-already-executed)
        
        ;; Check if not cancelled
        (asserts! (not (get cancelled proposal)) err-already-cancelled)
        
        ;; Check if quorum is met
        (asserts! (>= total-votes (var-get minimum-quorum)) err-quorum-not-met)
        
        ;; Mark as executed using merge
        (map-set proposals proposal-id (merge proposal {executed: true}))
        
        ;; Return result
        (ok {
            proposal-id: proposal-id,
            passed: (> (get yes-votes proposal) (get no-votes proposal)),
            yes-votes: (get yes-votes proposal),
            no-votes: (get no-votes proposal),
            total-votes: total-votes,
            quorum-met: true
        })
    )
)

;; Read-only Functions

;; Get proposal details (Clarity 4: improved optional handling)
(define-read-only (get-proposal (proposal-id uint))
    (ok (map-get? proposals proposal-id))
)

;; Get vote details for a specific voter
(define-read-only (get-vote (proposal-id uint) (voter principal))
    (ok (map-get? votes {proposal-id: proposal-id, voter: voter}))
)

;; Get voter weight
(define-read-only (get-voter-weight (voter principal))
    (ok (default-to u1 (map-get? voter-weights voter)))
)

;; Get total number of proposals
(define-read-only (get-proposal-count)
    (ok (var-get proposal-counter))
)

;; Get minimum quorum (new feature)
(define-read-only (get-minimum-quorum)
    (ok (var-get minimum-quorum))
)

;; Get delegation for a voter (new feature)
(define-read-only (get-delegation (voter principal))
    (ok (map-get? delegations voter))
)

;; Check if proposal is active (Clarity 4: match expression)
(define-read-only (is-proposal-active (proposal-id uint))
    (match (map-get? proposals proposal-id)
        proposal (ok (and 
            (>= stacks-block-height (get start-block proposal))
            (<= stacks-block-height (get end-block proposal))
            (not (get executed proposal))
            (not (get cancelled proposal))
        ))
        (ok false)
    )
)

;; Get proposal result
(define-read-only (get-proposal-result (proposal-id uint))
    (match (map-get? proposals proposal-id)
        proposal (ok {
            yes-votes: (get yes-votes proposal),
            no-votes: (get no-votes proposal),
            total-votes: (+ (get yes-votes proposal) (get no-votes proposal)),
            passed: (> (get yes-votes proposal) (get no-votes proposal)),
            executed: (get executed proposal),
            cancelled: (get cancelled proposal),
            quorum-met: (>= (+ (get yes-votes proposal) (get no-votes proposal)) (var-get minimum-quorum))
        })
        err-not-found
    )
)

;; Check if user has voted on a proposal (new feature)
(define-read-only (has-voted (proposal-id uint) (voter principal))
    (ok (is-some (map-get? votes {proposal-id: proposal-id, voter: voter})))
)

;; Get all delegators for a delegate (helper function, new feature)
(define-read-only (is-delegate-for (delegate principal) (delegator principal))
    (match (map-get? delegations delegator)
        current-delegate (ok (is-eq current-delegate delegate))
        (ok false)
    )
)
