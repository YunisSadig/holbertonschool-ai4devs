# Reflection on Legacy Code and AI

## Where AI explanations helped most
AI was most useful for turning dense code into readable explanations. jQuery's `$()` dispatcher, `Deferred.then` and the Ajax type converters are hard to follow line by line, and a plain-English summary with the pattern named gave me a map before I read the details. It also helped to produce structure quickly: the module documentation, the risk table and the list of things to check came together in far less time than doing them by hand.

## Where AI struggled
The explanations were only as good as their verification. When I ran the real library, my own checks failed several times, and the cause was the test setup, not the library. A polluted `Object.prototype` leaked into later calls, a fake network transport was picked after the real one, and a script test failed only because the DOM simulator would not run injected scripts. I also wrote two statements in my first overview that later evidence contradicted. One said the old build tools might not run on a current Node.js, and testing showed they do run. Another said I never executed exploit code, although my validation reproduced prototype pollution in an isolated window. A small automation script of mine even corrupted a document through a special replacement pattern. In each case, running something and reading the result caught the mistake, not rereading the prose.

## How AI influenced the modernization strategy
The biggest influence was a change of method. Instead of asking the AI which upgrade path was best, I turned its explanations into 18 executable tests and ran them on jQuery 1.12.4, 3.7.1 and 4.0.0. Only four behaviors differed: three about `Deferred` timing and error handling, and the fixed prototype pollution. That evidence shaped the plan: build the safety net first, then upgrade with the Migrate plugin, and only later replace jQuery with native APIs.

## Lessons for using AI on legacy projects
- Treat every AI explanation as a hypothesis, and test it against the real code before relying on it.
- Convert explanations into characterization tests; they protect you during the change and make claims checkable.
- Record what was not verified, such as the browser test suite, so the limits are visible.
- Separate observed facts (line counts, versions, advisories) from judgment (severity), and cite the source of each.
- Keep the human decisions human: which risks matter, which browsers to support, and what to change first.
- Fix wrong statements openly when new evidence appears; a corrected document is more valuable than a polished one.
