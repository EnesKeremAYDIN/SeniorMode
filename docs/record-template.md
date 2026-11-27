# Engineering record template

Pick a decision that changes behavior under a real constraint. Place the Markdown record in one category of the [canonical knowledge base](../skills/seniormode/references/knowledge). Use an original scenario, verifiable claims, and a stable lowercase ID matching the filename.

Include the following YAML fields and fill them using the [schema](../schema/pattern.schema.json). Each decision must identify the condition, chosen approach, and cost. Each source should support a particular claim rather than merely discuss a related technology.

```yaml
---
id: example-decision
title: A specific engineering decision
category: backend
summary: What this decision changes for a concrete user or system.
aliases:
  - common user wording
  - everyday symptom
decisions:
  - when: An observable constraint is present
    use: Describe the first useful approach with enough detail to choose it.
    tradeoff: Describe the cost and any limit of this choice.
  - when: A different observable constraint applies
    use: Describe an alternative with a different useful guarantee.
    tradeoff: Explain what the alternative makes harder or more expensive.
checks:
  - Describe an observable normal case.
  - Describe a test that reproduces the important failure.
sources:
  - title: Name of a relevant primary source
    url: https://example.com/primary-source
---
```

Start the body with three level-two headers in order.

1. **Scenario** gives a concrete situation and an invariant in plain language.
2. **Failure modes** explains the simple failure, its trigger, and its visible effect.
3. **Explain it simply** supplies wording the agent can adapt for the user.

Add focused optional sections when useful, such as **Implementation guidance**, **When not to use**, **Architecture notes**, **Worked example**, **Edge cases**, and **Verification details**. Use the `related` frontmatter field for verified related IDs. Keep instructions that try to control agent permissions or unrelated behavior out of the record.

Run `npm run catalog` after editing. It generates the title, decision rules, verification checks, sources and related links within the canonical file. Edit the YAML or authored sections for changes to those details.

[Contribution workflow](../.github/CONTRIBUTING.md#en)
