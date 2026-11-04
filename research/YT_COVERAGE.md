# YouTube analysis coverage — CGL 2023 Tier-1 + CHSL 2024 Tier-1 + CHSL 2023 Tier-1 + CHSL 2020 Tier-1 + CHSL 2025 Tier-1 (v2.8, 3 Nov 2026)

Method: browser slide-reading, analysis only (topic + teacher answer value + timestamp).
No question wording or option texts from videos are reproduced anywhere in this site.
Corpus tags were NOT overwritten by video evidence anywhere.

Aggregation: `tools/build_yt_analysis.py` merges `yt_analysis/*.json` into
`data/yt_analysis.json` (145 entries = 126 mapped corpus papers + 19 pending video-derived seeds — 18 missed CHSL 2023 shifts + 1 missed CHSL 2020 shift (21 Oct S1) — which have no corpus paper yet and therefore render nowhere in the site). Topic counts are derived from the per-row
`topic_match` values so they always reconcile with the files.

## CGL 2023 Tier-1 — 24/24 shifts (Exam Crack By Sudhir Sir)

- Questions: **600** — answers identified **591** (547 with letters + 44 values without a letter), **9 blank**
- Topic classification (rows): **510 exact, 59 compatible, 26 uncertain, 1 mismatch, 4 skipped-in-video rows with no topic**
  - The 5 "answers not clearly circled" rows on 17 Jul S4 carry a video topic but no answer, so classified rows (596) exceed identified answers (591) by exactly those 5.
- One real mismatch stands: 14 Jul S3 Q19 (tag Trigonometry, video DI bar-graph) — flagged, tag NOT overwritten.

Still blank (9) — left blank, never guessed:
- 17 Jul S3 Q24 — teacher skipped the question in the video
- 17 Jul S4 Q2, Q8, Q13, Q16, Q22 — answers not clearly circled
- 18 Jul S1 Q22 — teacher skipped (Circles tangents)
- 18 Jul S4 Q11 — teacher skipped (Geometry congruence)
- 20 Jul S4 Q24 (Simple Interest) — video shows 24 slides; its Q24 is the corpus Q25 (DI table), so Q24 was skipped

## CHSL 2024 Tier-1 — 36/36 shifts (Competition Preparation / Rohit Tripathi)

- Playlist: "SSC CHSL 2024 Maths Solution" (Sets 1–36 = 1, 2, 3, 4, 5, 8, 9, 10, 11 July, 4 shifts each; items 37–40 skipped: compilations, DI topic video, Tier-2 paper).
- Questions: **900** — rows content-matched **514**, unmapped video questions **386**
- Topic classification (matched rows): **329 exact, 34 compatible, 151 uncertain** (uncertain = mostly Simplification/other placeholder rows whose video topic is content-evidenced but the corpus tag is a placeholder)
- Video order differs from paper order for CHSL 2024 (proven on 1 Jul shifts): rows were matched by CONTENT (extracted stem and/or option values), never by question number.
- Video option letters are NOT reliable corpus keys (they agree with PDF option positions in only a minority of checkable cases); teacher VALUES are the key, letters recorded only as `video_letter`.
- Video gaps (questions not shown in the video, never guessed): Set-28 Q3/Q18/Q19/Q23, Set-31 Q25, Set-33 Q9, Set-35 Q15, Set-36 Q4/Q5.
- Contested rows (two video questions claiming one paper row, or one value fitting multiple rows) were left unmapped, with reasons recorded in each file's `unmapped_video_questions`.
- Set discrepancies resolved by content/position: Set-11 description says "3rd July 2nd Shift" but its values match the Shift-3 paper (filed as Shift-3); Set-18 description repeats a "1st Shift" template but thumbnail + spoken intro say 5 July Shift-2 (filed as Shift-2). Set-24's extra common-chord segment after Q25 was explicitly from another shift and was excluded.

## CHSL 2023 Tier-1 — 21/21 corpus shifts + 1 new paper (SSC LEARNING POINT BY SINGH SIR)

- Playlist: "SSC CHSL PRE MATHS 2023 ALL 40 SETS" (https://www.youtube.com/playlist?list=PLW8ml9R4TLmMgx4tOfyyUxaX3fF948_CQ). Items 1–40 are the 40 shift papers; item 41 is a best-questions compilation, skipped.
- Corpus overlap — important: the corpus holds only **21** of the 40 shifts (8 Aug S4 + 9/10/11/14/17 Aug × 4). The other **19 sets (2, 3, 4, 7 Aug × 4 + 8 Aug S1/S2/S3) have NO corpus paper** — a collection gap. UPDATE 3 Nov 2026: the user approved adding these 19 shifts to the corpus (freeze partially lifted). All 19 now have video analyses: **18 filed as pending seeds** (2 Aug S1–S4, 3 Aug S1–S4, 4 Aug S1–S4, 7 Aug S1, 7 Aug S3, 7 Aug S4, 8 Aug S1–S3) and **1 built as a full paper with keys** — 7 Aug S2 (PDF carries real stem+option text; its 25 keys come from the video track, matched by value against the paper's own options, 25/25 exact). PDFs for all 19 were recovered 3 Nov 2026 (Prepp page-source links); the other 18 are TCS response sheets whose stems need OCR (in progress) before their papers can be built — seeds serve as tagging/key cross-checks until then, and Chosen Option is never used as a key.
- **Text-less papers:** CHSL 2023 papers have essentially no extracted stems/options, so NO stem/option-value content matching was possible. Filing rule for this track: **unique-topic match only** — a video question was filed only when its topic matched exactly one corpus row's topic/sub-topic; every filed value is **unverified against options** and marked `topic_match: "uncertain"`. Ambiguous topics (multiple rows) and contested rows (two video questions, one paper row) were left unmapped with reasons. Corpus tags NOT overwritten.
- Questions: **550** video questions across 22 shifts — rows matched **161** (136 across the 21 original corpus papers + 25/25 exact for the new 7 Aug S2 paper). All 136 original matched rows are `uncertain` except one exact: 9 Aug S2's only row n=18 (Mensuration 3D conversion-and-melting) has an extracted stem (cuboid 20×16×8 melted into 4 cm cubes) and video Q24 "Mensuration — 40" was verified by stem + computation (2560/64 = 40).
- Per-shift matched rows: 8 Aug S4 10/25, 9 Aug S1 0/1, 9 Aug S2 1/1, 9 Aug S3 10/25, 9 Aug S4 7/25, 10 Aug S1 6/24, 10 Aug S2 11/25, 10 Aug S3 8/25, 10 Aug S4 7/25, 11 Aug S1 10/25, 11 Aug S2 7/24, 11 Aug S3 7/24, 11 Aug S4 4/23, 14 Aug S1 4/22, 14 Aug S2 4/25, 14 Aug S3 9/25, 14 Aug S4 1/1, 17 Aug S1 7/23, 17 Aug S2 8/24, 17 Aug S3 7/24, 17 Aug S4 8/25.
- Partial corpus papers (tagging/collection gaps, not YT failures): single-row papers 9 Aug S1 (n=11), 9 Aug S2 (n=18), 14 Aug S4 (n=25); rows missing from corpus: 9 Aug S3→n=7, 10 Aug S1→n=20, 11 Aug S2→n=10, 11 Aug S3→n=7, 11 Aug S4→n=8/21, 14 Aug S1→n=1/12/21, 17 Aug S1→n=9/13, 17 Aug S2→n=23, 17 Aug S3→n=13, 17 Aug S4→n=23.
- Title/position discrepancies resolved by title: 17 Aug S3 (#39) — description snippet said Shift-4, title + playlist position say Shift-3, title trusted. 14 Aug S3/S4 watch URLs were not captured in the browser report; those two files record playlist position + title confirmation instead.
- Video gaps (never guessed): 17 Aug S2 Q21 skipped by the teacher (video jumps Q20 → Q22). 9 Aug S4 Q25: teacher's working showed 295.2 but the ticked option was 300 — filed value is the ticked 300, discrepancy recorded in the file.
- The March-2023 (CHSL 2022 cycle) 20 corpus papers are a separate sub-track whose videos would be titled "CHSL 2022" — not yet started.

## CHSL 2020 Tier-1 — 35/35 corpus shifts (Competition Preparation / Rohit Tripathi)

- Playlist: "SSC CHSL 2019-20 SOLVED PAPERS" (https://www.youtube.com/playlist?list=PLN-ePsvZhNZXsP6fIx-ZTUQ4GlGpoqgSp). 37 items = 36 shift videos + 1 non-shift single-question video (skipped). **Naming trap:** the videos label themselves "SSC CHSL 2019 Tier-1" — this is the CHSL 2019 cycle held in March + October 2020, exactly the corpus's "CHSL 2020" set. Do NOT confuse with the same channel's separate playlist "SSC CHSL 2020 SOLVED PAPER" (items dated April/August 2021) — that is the wrong set.
- Corpus: 35 papers, 776 rows. The calendar's 36th shift, **21 Oct S1, has NO corpus paper** — its video (#32) is analysed separately as a missed-shift seed (window queued); it is NOT in this track's 35.
- **Text-less papers:** like CHSL 2023, these papers' extracted stems/options are image-only (empty or fragmentary text layer), so NO stem/option-value content matching was possible. Same unique-topic-only rule: a video question was filed only when its topic matched exactly one corpus row's topic/sub-topic; every filed value is **unverified against options** and marked `topic_match: "uncertain"`. Ambiguous topics and contested rows (two video questions, one paper row) were left unmapped with reasons. Corpus tags NOT overwritten.
- Questions: **875** video questions across 35 shifts — rows matched **297** (of 776 corpus rows). All matched rows are `uncertain`.
- Per-shift matched rows: 17 Mar S1 6/25, S2 0/25, S3 10/25; 18 Mar S1 7/25, S2 7/24, S3 9/25; 19 Mar S1 14/25, S2 12/25, S3 9/25; 12 Oct S1 0/1, S2 1/2, S3 8/25; 13 Oct S1 1/1, S2 3/3, S3 12/25; 14 Oct S1 11/25, S2 5/25, S3 8/25; 15 Oct S1 13/25, S2 12/24, S3 11/24; 16 Oct S1 6/22, S2 8/25, S3 9/25; 19 Oct S1 9/25, S2 7/25, S3 16/25; 20 Oct S1 10/25, S2 10/25, S3 13/25; 21 Oct S2 9/25, S3 11/25; 26 Oct S1 9/25, S2 10/25, S3 11/25.
- Partial corpus papers (tagging/collection gaps, not YT failures): single-row 12 Oct S1 (n=6 only), 13 Oct S1 (n=12 only); 3-row 13 Oct S2; 2-row 12 Oct S2; 24-row 15 Oct S2, 15 Oct S3, 18 Mar S2 (no n=21); 22-row 16 Oct S1. 13 Oct S1's single row was matched (successive P-L, video Q10); 13 Oct S2's all 3 rows were matched.
- Video style caveat: some videos are slide-style (all 25 ticked in sequence); others are **live-style recordings** where the teacher talks at length on one slide then jumps (17 Mar S1: Q8 → Q19, Q20 → Q23; 17 Mar S2: Q6 → Q22, never reaches Q23–25; 13 Oct S1/S2: several questions covered in seconds between longer ones, some not captured). Only green-ticked, clearly visible answers count; everything else is unmapped, never guessed from audio.
- Video gaps and contested pairs (never guessed): 17 Mar S2 0/25 (only 5 questions visible, all ambiguous); 14 Oct S2 only 5/25 (three contested pairs — Exponents/Surds, T&W ×2, Number-system ×2 — both sides left unmapped; Q10/Q25 unclear, Q23 not shown); 14 Oct S3 rapid DI set Q16–Q18 unclear (options below frame); 15 Oct S2 Q15 unclear (preview only, ad break); 21 Oct S3 Q13 skipped; 13 Oct S1 Q8/Q17/Q20 not captured, Q24 unclear; 13 Oct S2 Q11 not captured, Q6/Q24/Q25 unclear; 26 Oct S2 T&W pair (Q5/Q15) both left unmapped; 21 Oct S2 P-L pair (Q1/Q13) both left unmapped.
- Title/position discrepancies resolved by title: 13 Oct S3 slides carry an erroneous "1st Shift" banner (pinned comment explains; title + description say 3rd Shift, trusted); 16 Oct S3 banners show "2018" in error (title + paper header confirm 2019 / 16 Oct 2020, trusted); 3 Aug-adjacent note does not apply here.
- The March-2023 (CHSL 2022 cycle) 20 corpus papers are a separate sub-track whose videos would be titled "CHSL 2022" — not yet started.

## CHSL 2025 Tier-1 — 9/9 corpus shifts (SSC LEARNING POINT BY SINGH SIR)

- Playlist: "SSC CHSL PRE MATH 2025" (51 videos; 50 shift videos + 1 compilation skipped). Corpus holds only 9 "-Similar" papers (13 Nov S2, 14 Nov S2, 14 Nov S3, 15 Nov S1, 15 Nov S3, 17 Nov S1, 18 Nov S1, 20 Nov S1, 21 Nov S1); the other 15 playlist shifts have no corpus paper and are NOT filed (missed-shift addition for CHSL 2025 is not approved).
- Questions: **225** — rows content-matched **51** (14 Nov S3 10, 15 Nov S1 4, 15 Nov S3 3, 17 Nov S1 2, 18 Nov S1 9, 20 Nov S1 5, 21 Nov S1 4, 13 Nov S2 6, 14 Nov S2 8). All 51 are `uncertain` except the 20/21 Nov content matches, which are `exact` (option value + topic).
- CAUTION — "-Similar" papers are not necessarily the official shift papers: filing used content matching where text exists, otherwise unique-topic-only, with mismatch flags, never forced. Contested rows (two video questions, one paper row; or one value fitting multiple rows) stay unmapped both sides.
- 14 Nov S2 text-file warning: its letter-sequence `questions_text` file was inspected and found MISALIGNED (n25 options are GA UT names, n5 options are seconds, extracted_count 94 vs 25 tagged) — it was NOT used for content matching; that paper was filed unique-topic-only, and the file needs re-alignment in the tagging-correction pass. Same GA-leak pattern as 20 Nov S1 n25 (chemistry terms).
- 13 Nov S2 Q9 was not covered in the video (jump Q8 → Q10); 14 Nov S2 Q3 has a value but no clearly marked letter. Nothing guessed.

## Combined

- Papers with YouTube analysis: **126** (24 CGL 2023 + 36 CHSL 2024 + 22 CHSL 2023 + 35 CHSL 2020 + 9 CHSL 2025), plus 19 pending video-derived seeds (18 missed CHSL 2023 shifts + 1 missed CHSL 2020 shift) held in the aggregate with 0 mapped rows
- Content-matched / identified rows: **1,614** (591 + 514 + 161 + 297 + 51)

## How it appears in the site

`data/yt_analysis.json` is loaded by `js/library.js` on the paper detail page:
a "YouTube video analysis" section with the channel name, video link, per-question
video topic + teacher answer + timestamp, match badges, uncertain-topic flags, and
the video questions that could not be mapped to a paper row. Corpus tag rows were NOT modified.

## v2.9 — 2026-11-03: 18 missed CHSL 2023 papers built from OCR + Group D first batch in aggregate
- All 18 TCS response sheets (2/3/4/7/8 Aug 2023, except 7 Aug S2 which was already a text paper) are now full corpus papers: 450 stems + 4 options each, OCR-derived (tesseract 5.3.4, 200 dpi, Question-ID segmentation; mode "ocr" in the questions index).
- Keys: 249/450 value-confirmed from the Singh Sir video seeds by exact value-match against the paper's own OCR options (never from "Chosen Option", which is the candidate's own choice). 46 further rows matched topic-only (uncertain, no key assigned). 155 video questions / rows left unmapped with reasons (OCR digit garble, common-value ambiguity, skipped video questions, categorical-only seed answers) — never forced.
- Known OCR limits, stated on each paper's cycle note: symbols may read as V (root) or ? (superscript); a few stems are heavily garbled (notably 04 Aug S3 Q1/Q8, 04 Aug S1 Q11 whose option 1 is unreadable); difficulty is "uncertain" for all OCR rows (not assessed).
- The 18 video seeds are consumed (replaced by mapped files). The only pending seed left is 21 Oct 2020 Shift 1 (no PDF).
- Group D first batch (8 papers, 159 rows) is now also in the aggregate.
- Aggregate now: 153 entries, 2,068 content-matched rows. Corpus: 1,639 papers, 41,369 tagged, 17,560 with text (42.4%), full question+options 16,332 (15,907 real + 425 (+)).
