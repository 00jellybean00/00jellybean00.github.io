# primer-inventory 매니저 브리핑 발표자료 Unknown Unknowns

- 날짜: 2026-07-27
- 입력: [요구사항 문서](2026-07-27-primer-inventory-deck-requirements.md)
- 스캔 렌즈: conventions / similar-features / integration-points / edge-cases / domain

## 이 문서를 읽기 위한 말

- **결합 판정**: 어떤 primer가 대상 서열의 어느 자리에 붙는지 컴퓨터로 찾아내는 일입니다.
- **앵커(anchor)**: primer의 3' 쪽 끝에서 몇 글자가 정확히 맞아야 붙었다고 볼지 정한 길이입니다.
- **판독 구간**: primer 뒤로 얼마를 버리고 얼마를 읽을 수 있다고 볼지 정한 두 숫자입니다.
- **덮임 그림(커버리지)**: 목표 구간 중 어디까지 읽히는지 보여주는 그림입니다.
- **탐욕 선택**: 매번 가장 이득이 큰 것을 하나씩 집는 방식입니다. 빠르지만 최선을 보장하지 않습니다.
- **화면 폭(칸)**: 글자 너비가 모두 같은 글꼴에서 한 줄이 차지하는 칸 수입니다. 한글은 두 칸입니다.
- **웹 브라우저로 넘겨 보는 발표자료 도구(reveal.js)**: 슬라이드를 웹 페이지로 만들어 주는 도구입니다.
- **미리 정해 둔 설정 묶음(프리셋)**: 판독 구간의 두 숫자를 한 번에 고르게 해 주는 이름표입니다.
  이 도구에는 `conservative`와 `moderate`와 `optimistic` 세 가지가 있습니다.
- **전체 plasmid를 한 번에 읽는 새 방식(나노포어)**: 서열을 토막 내지 않고 통째로 읽는 최근 방식입니다.
- **글꼴 파일을 저장소에 함께 넣기(번들)**: 보는 사람 컴퓨터에 글꼴이 없어도 되게 만드는 방법입니다.
- **계층 분리**: 계산하는 코드와 화면에 찍는 코드를 서로 섞지 않고 나눠 두는 것입니다.

## 해소된 항목

| # | 발견 (근거 파일:라인 또는 출처 URL) | 구체화된 질문 | 결정 | 결정 주체 |
|---|---|---|---|---|
| 1 | 결합 판정 하한 40도. 시퀀싱 반응(BigDye v3.1)의 결합 온도는 50도 고정. 업체 권고 primer 녹는점 50~60도. `core.py:18` `DEFAULT_MIN_TM = 40.0` / https://tools.thermofisher.com/content/sfs/manuals/cms_081527.pdf / https://genomics.healthsci.mcmaster.ca/services/sanger-sequencing/ | 반응 온도보다 10도 낮은 판정 하한을 발표에서 어떻게 다룰까 | 약점으로 먼저 밝힌다. "아직 못 미더운 것" 슬라이드에 넣는다. 40도는 "이 자리에 붙는다를 찾는 하한"이고 "이 primer를 쓰면 된다는 기준"이 아니라고 나눠 설명한다 | 사용자 |
| 2 | 앵커 13글자짜리 결합의 녹는점이 GC 46%일 때 40.5도. 판정 하한 40도와 거의 같은 자리에서 만남. 대상 저장소 `implementation-notes.md:107` / `report.md:120` | 판정이 서열 성질에 따라 뒤집힐 수 있다는 사실을 발표에 넣을까 | 넣는다. 1번과 같은 슬라이드에 묶는다 | 사용자 |
| 3 | 설정 묶음(프리셋) `optimistic`이 버리는 길이는 150. `conservative`는 100. 그래서 100번부터 150번까지 구간이 낙관 설정에서만 안 읽힘. `cli.py:24-29` / https://blog.genewiz.com/analyzing-sanger-sequencing-data | 아무도 지적하지 않은 이 논리 구멍을 먼저 밝힐까 | 먼저 밝힌다. 약점 슬라이드에 넣는다. 150은 시퀀싱 업체가 공지한 값이 아니라 다른 도구의 기본값을 가져온 숫자라고 적는다 | 사용자 |
| 4 | SnapGene 실물 파일로 한 번도 실행된 적 없음. `.dna` 테스트는 "SnapGene 파일이 아니다"를 확인하는 실패 사례 하나뿐. `tests/test_readers.py:116-120` / 대상 저장소 `report.md:229` | "SnapGene 지원"을 완성된 기능으로 말할까 | 미검증으로 명시한다. 그 자리에서 매니저에게 실물 파일을 요청한다 | 사용자 |
| 5 | 테스트 149개가 좌표 계산은 두껍게 검증하나 녹는점 값을 문헌치와 대조하는 확인은 0건. `tests/test_design.py:203-218`. 149는 pytest 수집 기준이고 테스트 함수 자체는 117개(실측 확인) | "검증했다"는 말을 어디까지 쓸까 | "좌표 계산은 검증, 판정 기준은 문헌 근거만"으로 나눠 말한다. 약점 슬라이드에 넣는다. 개수는 149로 적는다. 대상 저장소 보고서가 149로 쓰기 때문이다 | 사용자 |
| 6 | 대상 저장소 설계 문서에 미해소로 적힌 질문. 전체 plasmid를 한 번에 읽는 새 방식이 샘플당 15달러. `explainer.md:329` | 프로젝트 존재 이유를 흔드는 이 질문을 발표에 올릴까 | 범위 논의의 첫 장으로 정면에 올린다 | 사용자 |
| 7 | 가장 가까운 경쟁 도구는 Geneious Prime. 보유 primer 테스트와 구간 나눠 읽기 설계를 각각 제공. 둘을 합친 최소 조합 계산은 없음. https://manual.geneious.com/en/latest/Primers.html | "이미 있는 도구로 되지 않나"에 어떻게 답할까 | 본론에 비교 표 한 장을 넣는다. Geneious와 SnapGene과 Primer3가 각각 무엇을 하고 무엇을 안 하는지 적는다 | 사용자 |
| 8 | 고리 모양 서열에서 역방향 primer 제안이 전부 틀렸던 문제. 테스트 111개가 전부 통과하는 중에 살아 있었음. 검증 방식을 바꾸니 제안 90개 중 26개가 실패로 드러남. `implementation-notes.md:291-303` | 이 이야기를 발표에 넣을까 | "어떻게 검증했나" 슬라이드로 넣는다. 실패담이 아니라 검증 방식을 바꾼 이야기로 쓴다. 111개는 그 당시 개수라고 한 줄 덧붙인다. 지금 개수인 149개와 헷갈리지 않게 한다 | 사용자 |
| 9 | 실행 화면 원문은 48줄이고 최대 화면 폭 127칸. 기본 설정에서 글자가 쓸 수 있는 폭은 921.6px이고 글꼴 23.1px 기준 약 66칸. 세로는 480px 상한이라 안쪽 여백 제외 448px, 기본 크기로 약 16줄. `assets/galaxy-reveal.css:93-104` / `slides/vendor/reveal/theme/black.css` | 48줄 127칸을 한 장에 못 넣는데 어떻게 할까 | 네 묶음으로 나눈다. 그중 세 묶음이 사용법 슬라이드가 된다. 나머지 한 묶음은 판정 기준 슬라이드로 간다. 각 묶음의 줄 범위와 폭과 글꼴 크기는 아래 "실행 화면 분할 계획" 절에 적었다. 나누면 글꼴을 키울 수 있다. PDF는 `?print-pdf`로 뽑아야 안 잘린다 | 자체 해소 |
| 10 | 등폭 글꼴이 저장소에 파일 없이 시스템 글꼴에 의존. 한글 폭이 라틴 문자의 정확히 두 배가 아닌 글꼴에서는 세로줄이 어긋남. `assets/galaxy-reveal.css:16`. 덮임 그림 안에도 한글이 하나 있음. `합계` 레이블이다. 실행 출력 25번째 줄 | 한글 정렬이 깨질 위험을 어떻게 막을까 | 글꼴 파일을 저장소에 넣지 않는다. 대신 피해 범위를 확인했다. 덮임 그림에서 한글은 `합계` 레이블 하나뿐이다. 그 레이블은 줄 맨 앞에 있다. 그래서 어긋나도 그 한 줄의 막대 시작 위치만 밀린다. 위쪽 primer 세 줄과 좌표 줄과 구분선은 한글이 없어 서로 맞은 채로 남는다. 대신 발표 전 실제 기계에서 열어 보는 것을 필수 점검으로 올린다 | 자체 해소 |
| 11 | 요구사항은 결합 판정 부분과 녹는점 계산 부분을 모두 실으라고 정함. 스캐너가 추천한 후보 6개에는 그 둘이 한 함수에 있는 `core.find_bindings`가 빠져 있었음. `core.py:186-210`, 25줄. 이 함수 안 208번 줄이 녹는점을 계산함 | 어느 함수를 몇 개 실을까 | 두 자리를 싣는다. 첫째는 `core.find_bindings`다. 결합 자리 모으기와 녹는점 계산이 한 함수에 있어 요구사항 두 부분을 한 장으로 채운다. 설명글에 "여기서는 녹는점으로 거르지 않는다"는 이유까지 적혀 있다. 다만 13글자가 맞는지 세는 일 자체는 이 함수가 부르는 다른 함수(`core.find_sites`)에 있다. 발표에서 이 단서를 한 줄 붙인다. 둘째는 설계 판정 기준 5개가 한 화면에 보이는 `design._evaluate`의 앞부분이다. `design.py:285-313`, 29줄이다 | 자체 해소 |
| 11-1 | 설정 묶음의 숫자가 좌표로 바뀌는 자리. `core.read_window`(216-225)와 `core.dead_zone_region`(228-232). 사이 빈 줄까지 `core.py:216-232` 17줄 | 이 자리도 본론에 실을까 | 본론에는 싣지 않는다. 부록으로 돌린다. 본론 코드는 두 장이 상한이다 | 자체 해소 |
| 12 | 예시 데이터의 `M13-F`가 실제 M13 서열이 아님. 실험 전문가가 슬라이드에서 즉시 알아챌 수 있음. `examples/demo_primers.csv` | 예시 데이터의 이름 문제를 어떻게 처리할까 | 사용법 첫 장에 "예시 데이터는 합성 서열입니다"라는 한 줄을 붙인다. 대상 저장소는 고치지 않는다 | 자체 해소 |
| 13 | 대상 저장소 README의 새 primer 설계 예시가 재현되지 않음. 고쳐진 버그의 옛 출력임. README:98-106 대 실제 출력 | 어느 출력을 발표에 쓸까 | 실제로 재실행한 출력만 쓴다. README 예시는 쓰지 않는다 | 자체 해소 |
| 14 | 제외 사유 주석이 두 가지로 적혀 있으나 실제 값은 세 가지. `core.py:72` 주석 대 `core.py:268,280,301` | 제외 사유를 몇 가지로 말할까 | 세 가지로 말한다. 여러 곳에 붙음, 유일한 자리가 너무 약함, 목표를 못 덮음이다 | 자체 해소 |
| 15 | 덮임 비율은 정확한 최댓값이고 primer 개수만 근사임. 종료 조건상 최종 덮임 집합이 항상 전체 후보의 합집합과 같음. `coverage.py:148-180` | 화면 문구가 "이론상 최소는 아닐 수 있다"고만 적혀 있는데 발표에서 어떻게 말할까 | 나눠 말한다. 덮임 비율은 정확하고 primer 개수만 근사라고 적는다 | 자체 해소 |
| 16 | 겹침 20글자가 Sanger 조립 표준 프로그램 Sequencher의 기본값과 정확히 일치. `moderate` 설정 묶음의 50과 500이 Primer3 시퀀싱 기본값과 정확히 일치. https://bip.weizmann.ac.il/toolbox/target/dna/sequencher_4.8_tour.pdf / https://primer3.ut.ee/primer3web_help.htm | 방어가 쉬운 숫자를 어디에 배치할까 | 판정 기준 슬라이드의 앞쪽에 둔다. 근거가 확실한 것을 먼저 보이고 약한 것을 뒤에 둔다 | 자체 해소 |
| 17 | 근거가 가장 강한 설정은 `moderate`인데 도구의 기본값은 `conservative`. `cli.py:29` `DEFAULT_PRESET = "conservative"`. 이유는 대상 저장소 `explainer.md:70`에 있음. "오탐은 실험 재수행, 미탐은 primer 하나 추가로 끝" | 왜 근거가 가장 강한 값을 기본으로 안 쓰는지 답을 준비할까 | 준비한다. 두 실수의 비용이 다르다는 논리를 슬라이드에 적는다. 잘못 "읽힌다"고 하면 실험을 다시 해야 한다. 잘못 "안 읽힌다"고 하면 primer 하나만 더하면 된다 | 자체 해소 |
| 18 | 실측 결과. 앵커를 13에서 10과 16과 20으로 바꿔도 예시 결과가 동일. 하한을 40에서 50으로 올려도 동일. 60으로 올리면 추천 3개에 82%로 바뀜. 설정 묶음을 `moderate`로 바꾸면 빈 구간과 설계 제안이 통째로 사라짐 | 이 실측 결과를 발표에 넣을까 | 넣는다. 약점 슬라이드에 적는다. 앵커는 10과 16과 20에서 결과가 같았다고 적는다. 하한은 50까지 같고 60에서 달라졌다고 적는다. 결과를 크게 바꾸는 것은 판독 구간 설정뿐이라고 적는다 | 자체 해소 |
| 19 | 계산 코드 세 파일에 화면 출력과 파일 접근이 0건. 웹 화면을 붙일 때 화면 코드 하나만 갈아 끼우면 된다는 주장이 코드로 확인됨. `core.py` / `coverage.py` / `design.py` 전체 | 구조 설명에서 무엇을 단언해도 될까 | 계산과 화면을 나눠 둔 것은 단언한다. 다만 그림에는 다섯 층으로 그린다. 계산 셋, 파일 읽기 하나, 화면 하나다 | 자체 해소 |
| 20 | 성능은 plasmid 규모에서 문제없음. 다만 목표 구간을 지정하지 않으면 최악 경로가 기본값이 됨. 12만 글자에 후보 400개면 17.1초 | 적용 범위를 발표에 명시할까 | 명시한다. plasmid 규모용이라고 적는다. 더 큰 서열 질문에 대비해 숫자를 부록에 둔다 | 자체 해소 |
| 21 | 설계 문서에 결정 29건, 대안 21건, 범위 제외 18건, 열린 질문 7건이 있음. 합계 75개 항목 | 1,522줄 중 무엇을 발표에 올릴까 | 논의 4개 항목에 맞춰 고른다. 배치는 아래 "설계 문서 발췌 배치" 절에 적었다 | 자체 해소 |
| 22 | 수식 표시 기능을 남겨 두면 본문에 달러 기호가 두 번 나올 때 그 사이가 수식으로 바뀜. 새 방식 이야기에 금액이 나올 수 있음. `slides/demo/index.html:207,229-230` | 수식 기능을 남길까 | 새 발표자료에는 넣지 않는다. 견본 발표자료 파일은 손대지 않는다. 이 발표에는 수식이 없고 금액 표기가 들어갈 수 있기 때문이다 | 자체 해소 |
| 23 | 다이어그램 도구가 3.4MB이고 필요할 때만 불러옴. 차트 도구는 항상 불러옴. `slides/demo/index.html:209-210` | 이 두 가지를 쓸까 | 새 발표자료에는 넣지 않는다. 견본 발표자료 파일은 손대지 않는다. 구조 그림은 글자로 그린 상자와 표로 대신한다 | 자체 해소 |

### 실행 화면 분할 계획 (해소된 항목 9번의 상세)

실행 출력은 모두 48줄입니다.
그중 빈 줄이 일곱 줄이라 내용이 있는 줄은 41줄입니다.
이 출력을 네 묶음으로 나눕니다.
네 묶음에 들어가는 줄은 모두 46줄입니다.
그중 다섯 줄은 묶음 안쪽의 빈 줄입니다.
묶음과 묶음 사이의 빈 줄인 18번과 32번만 버립니다.
네 묶음 중 세 묶음이 사용법 슬라이드가 됩니다.
나머지 한 묶음은 사용법이 아니라 판정 기준 슬라이드로 갑니다.
줄 번호와 화면 폭은 모두 실측값입니다.
글꼴 크기는 글자가 쓸 수 있는 폭 921.6px에서 계산한 값입니다.

| 묶음 | 원문 줄 범위 | 줄 수 | 최대 폭 | 필요한 글꼴 크기 | 놓을 자리 |
|---|---|---|---|---|---|
| 실행 화면 1 | 1~12 | 12줄 | 101칸 | 15.2px | 사용법 첫 장 |
| 실행 화면 2 | 19~31 | 13줄 | 102칸 | 15.1px | 사용법 둘째 장 |
| 실행 화면 3 | 33~48 | 16줄 | 97칸 | 15.8px | 사용법 셋째 장 |
| 추천 이유 안내 | 13~17 | 6줄 (접은 뒤) | 86칸 (접은 뒤) | 17.9px | 판정 기준 슬라이드 |

네 번째 묶음의 줄 수와 폭만 접은 뒤의 값입니다.
접기 전에는 5줄이고 최대 127칸입니다.

네 묶음 모두 세로로도 들어갑니다.
가장 빡빡한 것은 셋째 장입니다.
셋째 장은 23줄까지 들어가는 자리에 16줄만 넣습니다.

13번부터 17번까지 다섯 줄은 추천 이유를 적은 안내입니다.
이 다섯 줄은 사용법이 아니라 판정 근거를 보여 줍니다.
그래서 사용법 장수에 넣지 않고 판정 기준 슬라이드에서 씁니다.
이 다섯 줄 중 16번 줄이 127칸으로 가장 넓습니다.
16번 줄만 두 줄로 접고, 접었다는 표시를 답니다.
접으면 여섯 줄이 되고 최대 폭이 86칸으로 내려갑니다.

사용법 슬라이드는 세 장으로, 요구사항이 정한 상한 3장을 모두 씁니다.

캡션을 다는 자리는 다음과 같습니다.
명령어 한 줄은 사용법 첫 장에 답니다.
"예시 데이터는 합성 서열입니다"라는 한 줄도 사용법 첫 장에 답니다.

### 설계 문서 발췌 배치 (해소된 항목 21번의 상세)

대상 저장소 설계 문서에서 발표에 올릴 항목을 논의 주제별로 골랐습니다.

- 논의 1(판정 기준 타당성)에는 실험 판정 계열 결정 7건을 올립니다.
  `explainer.md`의 결정 10번, 11번, 12번, 13번, 15번, 16번, 21번입니다.
- 논의 2(다음 우선순위)에는 범위 제외 중 "나중에 함"이 명확한 4건을 올립니다.
  웹 화면, 실제 SnapGene 파일 검증, 덮임 그림 파일 저장, 파일 쓰기 해제입니다.
- 논의 3(프로젝트 범위)에는 전체 plasmid를 한 번에 읽는 새 방식 질문을 올립니다.
  `explainer.md:329`입니다.
- 논의 4(랩 운영 연결)에는 미해소 질문 3건을 올립니다.
  랩에 이미 정리된 primer 목록이 있는지입니다.
  그 목록 파일을 어디에 둘지입니다.
  시퀀싱을 어느 업체에 맡기는지입니다.

## 미해소 항목

| # | 질문 | 보류 이유 | 재방문 시점 |
|---|---|---|---|
| 1 | 결합 판정 하한 40도를 실제로 고칠 것인가. 고친다면 탐지 하한과 사용 권고선을 따로 둘 것인가 | 발표자료를 만드는 일의 범위 밖이다. 매니저 피드백을 받은 뒤 정하는 것이 순서다 | 발표에서 매니저 답을 들은 직후 |
| 2 | 낙관 설정(`optimistic`)의 버리는 길이 150을 고칠 것인가 | 위와 같다. 발표에서 먼저 밝히기로 했으므로 매니저 의견을 듣고 정한다 | 발표 직후 |
| 3 | 대상 저장소 README의 낡은 예시를 고칠 것인가 | 대상 저장소를 고치는 일이다. 발표자료 작업과 저장소가 다르다 | 발표 후 대상 저장소 작업을 열 때 |
| 4 | 제외 사유 주석이 실제 값보다 하나 적은 것을 고칠 것인가 | 위와 같다 | 발표 후 대상 저장소 작업을 열 때 |
| 5 | 발표 기계에 한글 폭이 두 배인 등폭 글꼴이 있는가. 그리고 판독 설정 줄의 긴 줄표가 한 칸으로 그려지는가 | 발표 기계를 지금 알 수 없다. 덮임 그림에도 한글 레이블이 하나 있어 영향을 받는다. 다만 그 레이블은 줄 맨 앞이라 어긋나도 그 한 줄만 밀린다. 긴 줄표는 글꼴에 따라 두 칸으로 그려질 수 있다. 그러면 첫 장이 101칸이 아니라 102칸이 된다 | 발표 전 실제 기계에서 여는 것을 필수 점검으로 둔다 |
| 6 | ~~새 발표자료를 자동 링크 검사 목록에 넣을 것인가~~ **해소됨** | — | 작업 보고 시점에 사용자가 포함을 지시함. 목록에 추가했고, 페이지 안 스크립트 문법 검사도 새로 넣음 |

## 스캔 원본 요약

### conventions

대상 저장소(`primer-inventory`)의 설계 관례를 조사했다.

- **계층 분리는 예외 없이 지켜진다.** `core.py`/`coverage.py`/`design.py` 전체에서 `print(`, `open(`, `sys.`, `logging`, `Path` 호출이 0건. import 그래프 단방향, 순환 없음. 다만 `readers`가 `core`의 dataclass에 의존하므로 실제 구조는 "순수 3 + 입출력 1 + 화면 1"의 5층이다.
- **판정 상수의 근거가 비대칭이다.** `core.py:17-21`(`DEFAULT_ANCHOR=13`, `DEFAULT_MIN_TM=40.0`, `DEFAULT_DEAD_ZONE=100`, `DEFAULT_READ_LEN=400`, `CLOSE_TO_TARGET=100`)과 `coverage.py:23`(`DEFAULT_MIN_OVERLAP=20`)에는 인라인 근거 주석이 전무. 반면 `design.py:22-37`은 출처를 명시(`"Sequencing-primer consensus across GENEWIZ/Azenta, Cornell BRC and UNLV"`, `IDEAL_TM = 55.0  # BigDye v3.1 anneals at a fixed 50C`, `SEARCH_RADIUS = 20  # primer3's PRIMER_SEQUENCING_ACCURACY`).
- **프리셋 명명 규약이 의도적이다.** `cli.py:20-29` 주석: `"Named by the evidence each pair comes from rather than by a sequencing vendor. Vendors publish read lengths that count different things ... so a vendor name on a number would imply a precision that is not there."` 3-튜플 `(dead_zone, read_len, 출처문구)`. 주석의 "A~B번"은 출처가 공표한 창의 시작·끝이고 튜플의 두 번째 값은 `B - A`다.
- **Tm은 primer3-py 100% 위임.** 열역학 호출 4곳뿐(`core.py:208`, `design.py:298`, `design.py:315`, `design.py:316`). Biopython은 `readers.py:74`의 SnapGene 파싱 한 줄에서만 사용. 유일한 자체 구현은 `design.py:346-359` `end_pairs_back`이며 이유가 docstring에 명시.
- **순위 규칙이 세 개로 분리.** 추천 `core.py:333-340` 4-튜플 `(-covered, distance, three_prime, name)`; 설계 `design.py:89-94` 5-튜플 `(not gc_clamp, |Tm-55|, |GC-50|, drift, seq)`; 조합 `coverage.py:150-161` 탐욕 집합 커버. 관통 원칙은 "순위를 깎지 않고 안내 문구만 붙인다"(`core.py:315-330`).
- **고리(circular) 처리가 전 계층 관통.** 언급 횟수 core 37 / coverage 16 / cli 13 / design 11 / readers 6. 모든 고리 기하가 `core.py:80-94` `_segments`로 수렴. 함정이 주석으로 박제됨(`core.py:148-151` 이중 검출 방지, `core.py:121-123` 선형 modulo 금지).
- **타입·예외·테스트 관례가 일관.** 5개 소스 전부 `from __future__ import annotations`, `py.typed` 존재. `frozen=True`는 불변 값 객체, 평범한 `@dataclass`는 누적 결과 객체. 사용자 대면 예외는 `core.TargetError`와 `readers.InputError` 2종, `cli.main` 한 곳에서만 포착. 종료 코드 `EXIT_OK=0 / EXIT_INPUT_ERROR=1 / EXIT_NO_MATCH=3`. **테스트는 pytest 수집 기준 149개, `def test_` 함수는 117개**(`@pytest.mark.parametrize` 5곳 때문에 차이 발생, 직접 실행해 확인). 표준 mock 라이브러리 사용은 0건이나 손으로 만든 가짜 객체(`FakePart`/`FakeLocation`/`FakeFeature`, `tests/test_readers.py:132-159`)는 사용. `tests/test_design.py:32-46` `window_of`가 툴 주장을 믿지 않고 서열에서 되짚어 검증.
- **주석 불일치 1건.** `core.py:72` `reason: str  # "multi-binding" | "no-coverage"`이나 실제 생성값은 3종(`multi-binding` `core.py:268`, `weak-only` `core.py:280`, `no-coverage` `core.py:301`).
- **발표용 코드 후보 6개.** ① `design._evaluate` 싼 조건 블록 `design.py:285-313`(29줄, 판정 기준 5개가 한 화면, `"Every cheap rule is evaluated, not short-circuited, so the counts on screen are the real number"` 주석 포함) ② `core.read_window`(216-225, 10줄) + `core.dead_zone_region`(228-232, 5줄), 사이 빈 줄 포함 `core.py:216-232` 연속 17줄. **다만 요구사항이 지정한 두 부분(결합 판정·녹는점)은 `core.find_bindings`(`core.py:186-210`, 25줄)에 함께 있으므로 본론 코드로는 이쪽을 채택** — 208번 줄이 `primer3.calc_tm(primer.seq[-annealed:])`이고, docstring이 "검색 중에 Tm으로 거르면 진짜 두 번째 결합 자리가 문턱 아래로 사라진다"는 이유를 담고 있음 ③ `coverage.plan` 탐욕 루프 `coverage.py:148-163`(16줄) ④ `core.recommend` 정렬 키 `core.py:333-341`(9줄) ⑤ `core._segments` `core.py:80-94`(15줄) ⑥ `design.slot_count` `design.py:141-154`(14줄). 비추천: `core.find_sites` `core.py:136-177`(42줄, 길다).

### similar-features

대상 저장소 `docs/blindspot/` 문서 5개(1,522줄)를 전량 조사했다. 재활용 가능성이 매우 높다.

- **결정사항 29건이 `explainer.md:54-87`에 `| # | 결정 | 근거 |` 표로 완성돼 있다.** 실험 판정 계열은 D10(`:67` 3' 끝 13글자 정확 일치, 실무 표준), D11(`:68` 결합부 Tm 40도 이상, 시퀀싱 반응 온도 50도가 근거), D12(`:69` 13글자 바깥 불일치 허용, 5' 여분 서열 클로닝 primer 포섭), D13(`:70` 판독 100/400 보수값, 오탐은 실험 재수행·미탐은 primer 하나 추가), D15(`:72` 다중 결합 제외), D16(`:73-74` 고리 3곳 적용 + 이어 붙이는 양은 조각 길이 −1), D21(`:79` 이차구조 검사는 신규 설계에만).
- **대안·트레이드오프 21행이 `explainer.md:89-113`에 `| 결정 | 채택안 | 기각안 | 기각 이유 |`로 존재.** 반문 대응력 높은 순: `:93` Primavera 기각(Wallace rule Tm 부정확 / BLAST 외부 설치 / **재고 위치·용도 관리 없음**), `:97` BLAST 기각(20글자 수준에서 실제 결합 자리 약 40% 누락), `:96` 불일치 퍼센트 기각(3' 하나 어긋나면 시작 불가, 5'는 무해 → 정반대 판정), `:103-104` 판독 400 방어(낙관값은 오탐 시 재실험, 업체 공지값 700~1050은 세는 기준 상이), `:105` 다중결합 제외 근거(SnapGene은 보여주는 도구, 이 툴은 골라주는 도구), `:113` 겹침 20 방어(관행값 50~100은 업체 공식 근거 없음).
- **의도적 범위 제외 18건** (`explainer.md:306-319` 10건 + `report.md:221-230` 8건, 중복 3건). "나중에 함"이 명확한 것은 4건뿐: 웹 화면(`report.md:223`, 명시적 1순위, "네 기능이 모두 끝났으므로 다음은 화면이다"), **실제 SnapGene `.dna` 파일 검증**(`report.md:229`, "유일하게 남은 큰 미검증 영역"), 커버리지 그림 파일 저장(`:224`), 파일 쓰기 해제(`:227`). "영원히 안 함"은 PCR primer 쌍 설계, 유전체 특이성 검사, 보유 primer 이차구조 검사, 시퀀싱 결과 판독, primer 발주, 정확한 최소 조합.
- **열린 질문 7행** (`explainer.md:321-331`). 미해소 5건 중 3건이 "실제 랩 데이터가 있어야 답이 나온다" 성격. `:329`가 전략적으로 가장 무겁다 — 전체 plasmid 한 번에 읽기가 샘플당 15달러, "기능 4(신규 primer 설계)의 가치가 달라질 수 있음". 해소된 2건은 겹침 20글자 확정(`:328`)과 양쪽 가닥 자동 선택 안 함(`:331`, "근거 없는 자동 선택은 근거 없는 자동 배제만큼 나쁘다").
- **재방문 시점이 `unknowns.md:38-48`에 표 열로 명시.** 다만 `:46`(#5 나노포어)의 재방문 시점이 "기능 4 착수 전"인데 기능 4는 `report.md:149`에서 이미 완료 보고됨 — 재방문 시점을 놓친 항목이다.
- **알려진 약점 3건이 이미 평문으로 정리됨.** 최대는 경계 문제 — `report.md:120` "기본값 13글자 앵커와 40도 기준이 거의 경계에서 만난다", `implementation-notes.md:107` "GC 비율 46퍼센트인 13글자의 녹는점이 40.5도". `report.md:21`이 매니저용 평문으로도 작성: "판정이 서열 성질에 따라 뒤집힐 수 있습니다." 그 외 탐욕 근사(`report.md:23`), 정적 분석 미설정(`report.md:219`). 검증 결과는 `report.md:207-217`: pytest 149개 통과, 2.6초.
- **구현 노트의 "예상 못 한 문제" 5건** (`implementation-notes.md`). ① `:291-303` 고리 서열 역방향 primer 전량 오류 — 고리 분기에만 역상보 누락, **테스트 111개가 전부 통과하는 중에 생존**, 원인은 `:299` "산술이 산술을 검증할 뿐 서열은 한 번도 검증하지 않았다", 수정 후 제안 90개 중 26개 실패. ② `:326-333` primer3의 `calc_end_stability(seq, seq)`가 `calc_homodimer`와 완전히 같은 값 반환 — 실측 확인. ③ `:312-317` 단락 평가 때문에 탈락 사유 개수가 거짓 — 화면 "GC 30개" 대 실제 174개. ④ `:214-219` 성능 병목이 서열 길이가 아니라 후보 개수 쪽. ⑤ `:85-90` 선형 서열 거리 계산이 끝을 감싸던 버그.
- **계획 이탈 6건이 `report.md:232-250`에 자진 기록.** 기능 3 정의 변경(겹쳐 놓기 → 필요한 조합만), 제외 사유 2개→3개(`weak-only` 신설, "기준 온도를 조금만 낮추면 쓸 수 있었던 primer를 놓치면 이미 있는 것을 두고 새로 주문하게 된다"), 정렬 값 3개→4개, 프리셋 이름 업체명→근거명(`report.md:238`, "없는 정밀도를 가장하게 된다"), 거리 안내 하한 축소, primer 목록 공유 위치 미정.

### integration-points

이 저장소에 새 발표자료를 붙일 때의 접점을 조사했다. **위험도 높음** — 실행 화면이 가로·세로 양쪽에서 기존 상한을 뚫는다.

- **구문 강조는 이미 배선됨.** 테마 `../vendor/reveal/plugin/highlight/monokai.css`(`demo:14`), 플러그인 `demo:206`, 등록 `demo:230`. 관용구는 `demo:78`: `<pre><code class="language-python" data-trim data-line-numbers="1|3-8|10-11"><script type="text/template">`. `|` 구분 강조 단계는 fragment로 자동 분해. `data-trim`은 공통 들여쓰기만 잘라내므로 ASCII 정렬 보존. 터미널 원문은 `class="language-plaintext"` 명시 필요.
- **폭 계산 실측값.** 슬라이드 논리 크기 960×700px(reveal 기본, 덱이 미지정). `section` 좌우 여백 0. `pre code` 안쪽 여백 1.2rem×2 = 38.4px. **글자가 쓸 수 있는 폭 921.6px.** 기본 코드 글꼴 `0.55em × 42px = 23.1px`, 줄 간격 `1.2em = 27.72px`. 진폭 0.6em 기준 한 칸 13.86px → **기본 설정에서 66.5칸만 들어감**. 필요 글꼴 크기: 71칸→21.6px, 91칸→16.9px, 102칸→15.1px, 127칸→12.1px.
- **세로 제약이 더 치명적.** `galaxy-reveal.css:102`의 `pre code { max-height: 480px }`, 안쪽 여백 제외 448px. 들어가는 줄 수는 **기본 크기 23.1px에서 약 16줄**, 16.9px에서 22.1줄, 21.6px에서 17.3줄, 12.1px에서 30.9줄. **48줄은 최소 크기에서도 넘침.** `mouseWheel:false`가 기본이라 발표 중 스크롤 불가.
- **등폭 글꼴이 시스템 의존.** `--r-code-font: "JetBrains Mono", "D2Coding", ui-monospace, Menlo, Consolas, monospace`(`galaxy-reveal.css:16`). 저장소에 `@font-face` 0건. 진폭이 글꼴마다 다름(JetBrains Mono/Menlo ≈ 0.60em, Consolas ≈ 0.55em, D2Coding ≈ 0.50em). JetBrains Mono에는 한글 글리프가 없어 폴백되며, 그 폴백의 한글 진폭이 정확히 2배가 아니면 세로줄이 어긋남. **덮임 그림에도 한글이 하나 있음** — 25번째 줄의 `합계` 레이블(`cli.py:301,313`, 폭 계산은 `cli.py:521-522`가 한글 2칸을 가정). 줄 맨 앞이라 어긋나면 그 줄의 막대 시작점만 밀리고, 위 세 줄과 눈금 줄은 ASCII라 서로 정렬 유지.
- **인쇄는 두 갈래.** `?print-pdf`는 페이지 998.4×728px 고정이고 내용이 확대되지 않아 폭 921.6px 그대로. `html.reveal-print .reveal pre code{overflow:hidden!important}`(vendor `reveal.css`)가 적용되어 넘친 가로는 스크롤 없이 잘림 — 즉 **폭을 921.6px 안에 맞춰 두면 `?print-pdf`에서는 안 잘림**. 반대로 `?print-pdf` 없이 브라우저 인쇄하면 `.hljs`가 `white-space:pre-wrap` + 15pt로 바뀌어 정렬이 완전히 무너짐. **PDF는 반드시 `?print-pdf`로 뽑아야 함.**
- **재사용 가능한 CSS 클래스** — `.hero`(+`.tagline`) `galaxy-reveal.css:64-73`, `.muted` `:51`, `.lead` `:52`, `.cite` `:55-60`, `.figure` `:128-136`, `.cols` `:139-144`, `table` `:113-118`(`font-size:0.8em`, `th` 강조색), `.fragment`(reveal 내장), `aside.notes`. `.center-slide` `:46`은 정의만 있고 미사용. **주의**: `.cols`는 각 칸 470.4px, 코드 영역 432px로 줄어 넓은 원문을 넣으면 안 됨.
- **수식 기능의 함정.** `math.js`의 무시 태그에 `pre`/`code`가 있어 코드 블록 안의 `$`는 안전하나, 본문 `<p>`에 `$`가 두 번 나오면 그 사이가 수식으로 렌더됨. **견본에서 복사할 때 빼야 할 줄**(견본 파일 자체는 수정하지 않음): `demo:207`, `demo:229`, `demo:230`의 `RevealMath.KaTeX`. 빼면 `check-links.js:33-39`의 KaTeX 경로 검사도 자동으로 비활성화됨.
- **다이어그램·차트 관련: 견본에서 복사할 때 빼야 할 줄** (견본 파일 자체는 수정하지 않음) — `demo:210`(chart 스크립트 태그), `demo:233`(`renderChart()` 호출), `demo:234`(`renderMermaid()` 호출 — 233만 빼면 초기화 블록이 깨짐), `demo:239-322`(`loadScript`/`renderMermaid`/`setFallback`/`drawMermaid`/`dedent`), `demo:324-373`(`renderChart`). Mermaid는 `pre.mermaid`가 있을 때만 지연 로드(3.4MB).
- **그대로 복사할 `<head>`** — `demo/index.html:1-18` 전체. `:2` `lang="ko"`, `:5` viewport, `:7` favicon, `:9` 밝은 모드 인라인 스크립트(`<head>` 최상단 유지 필수), 스타일시트 **6개**(`:11` reset, `:12` reveal, `:13` theme/black, `:14` highlight/monokai, `:16` galaxy, `:17` galaxy-reveal — `:15`는 주석. galaxy 두 개가 반드시 reveal 기본 테마 뒤). `starfield.js`는 canvas를 스스로 만들며 `?receiver`/`?print-pdf`에서 자동 비활성.
- **CI 접점** — `check-links.js:12`의 `PAGES`는 `['index.html','slides/demo/index.html']` 하드코딩이라 새 덱 내부 경로는 미검사. 랜딩 카드를 추가하면 `:28`이 `slides/primer-inventory/` → `index.html`로 풀어 존재 여부를 검사하고, `:51-59`가 밑줄 시작 폴더명을 검사.

### edge-cases

대상 저장소의 취약점을 조사했다. 각 항목에 매니저의 예상 질문을 붙였다.

- **README의 새 primer 설계 예시가 재현되지 않음.** README:98-106의 역방향 후보 `AGCTGCGCATCTGGTACT`은 데모 plasmid 2280번부터의 **정방향 원본 서열 그대로**이며 역상보가 아님 — `design.py:264-269` 주석이 "고쳤다"고 적은 바로 그 버그의 출력. 정방향 후보도 현재 3' 말단 자기결합 필터에 걸려 탈락(3' 5염기 `AGCTC`의 역상보 `GAGCT`가 자기 서열 12번 자리에 존재). README는 "두 가닥 모두 통과"라 쓰나 실제 출력은 "역방향 조건을 통과한 후보가 없습니다". 같은 저장소의 `report.md`는 최신 출력을 보유 — README만 갱신 누락. **예상 질문**: "README에 있는 이 역방향 primer, 지금 주문하면 되나요?"
- **README 커버리지 그림은 본체는 일치하나 경고 3줄이 잘려 있음.** 실제 출력에는 그림 뒤에 덮이지 않은 구간 목록, `M13-F과 CLONE-F의 판독 구간이 0 bp만 겹칩니다 (권장 20 bp 이상)`, 최소성 단서가 따라옴. **예상 질문**: "겹침이 0 bp인 조합을 왜 추천 결과로 내놓나요?"
- **탐욕 선택의 실제 성질.** `coverage.py:110-180`. 종료 조건상 **최종 덮임 집합은 언제나 전체 후보의 합집합 → 화면의 96%는 근사가 아니라 정확한 최대 커버율**. 보장 안 되는 것은 primer 개수뿐이며, 이유는 (1) 집합 커버 탐욕의 근사 한계 (2) **선택 후 잉여 제거 단계 부재**. 데모 사례는 검산 결과 실제로 3개가 최적. **예상 질문**: "3개가 최소라는 걸 증명할 수 있나요?"
- **판정 숫자 민감도 실측.** 데모에서 `--anchor` 10/16/20, `--min-tm` 40→50 모두 **결과 완전 동일**(5개 추천, 3개 조합, 96%). `--min-tm 60`에서야 3개/82%로 변화. 반대로 `--preset moderate`면 **빈 구간·이음매 경고·설계 섹션이 전부 사라지고 100% 덮임** — 데모의 극적인 두 장면이 conservative 선택의 산물. 참고: 데모 서열의 모든 13-mer Tm 중앙값 41.1도(범위 20.2~63.8), 43.5%가 40도 미만. **예상 질문**: "판독 길이를 400에서 500으로만 바꿔도 새 primer가 필요 없어지는데, 400의 근거가 뭔가요?"
- **Tm이 PCR 기본 조건으로 계산됨.** `core.py:208`·`design.py:298` 모두 인자 없이 `primer3.calc_tm(seq)` 호출. primer3 기본값은 1가 양이온 50 mM, 2가 1.5 mM, dNTP 0.6 mM, DNA 50 nM(PCR 기준). 실측: `CATCGACGCCTTGTGTAC`가 기본 55.95도, 시퀀싱 primer 농도 320 nM이면 58.74도(+2.8), 2가/dNTP를 0으로 두면 50.47도(−5.5). 소스 전체에 염 농도 인자 0건. 임계값 비대칭 — 재고 primer는 40도면 추천(`core.py:18`), 신규 설계는 50도 미만 거절(`design.py:27`). **예상 질문**: "이 Tm은 어떤 buffer 기준인가요? Tm 41도짜리가 1순위로 올라올 수 있나요?"
- **결합 판정은 완전 일치만 인정.** `core.py:159-177`. 실측: 3' 5번째 염기 하나만 틀려도 결합 0건. mutagenesis/SNP primer는 "이 서열에 붙지 않아 표시하지 않았습니다"에 묻힘. degenerate primer는 `_VALID_BASES` 통과하나 완전 일치 검색에 안 잡히고, `ambiguous_base_warning`은 **대상 서열에만** 적용되고 primer에는 미적용(실측: `ACGTNNRYACGTACGTACGT` 무경고 통과 후 결합 0건). 미실시: primer 간 이합체 검사, template 바깥 특이성, template의 GC-rich/hairpin으로 인한 판독 실패. **예상 질문**: "우리 mutagenesis primer랑 degenerate primer는 왜 목록에 안 뜨나요?"
- **입력 라우팅이 확장자 하나로만 갈림.** `.dna`만 SnapGene, 나머지 전부 CSV. 실측 오류: `.fasta` → "이름 열 'name'이(가) 없습니다. 있는 열: >pDEMO-1 test", `.gb` → "있는 열: LOCUS       pDEMO 2620 bp DNA circular". 잘 막는 것: 빈 파일, 헤더만 있는 파일, 비염기 문자, 옵션 범위(inf/nan 포함). 빈틈: UTF-16 CSV 미지원, 대상 CSV 동명 중복 시 무경고 첫 줄 선택(primer 중복은 경고하므로 비대칭), `--min-tm` 상하한 검증 전무. **예상 질문**: "우리는 서열을 FASTA로 주고받는데, 그건 안 되나요?"
- **SnapGene 경로 미검증.** 가정은 "첫 패킷 헤더 5~12바이트가 `SnapGene`"뿐, 버전 필드 미검증. 나머지는 Biopython 1.87 파서에 위임하며 그 한계가 자체 조사에 기록됨(패킷 일부만 처리, origin wrap 버그 #5162/#5163, primer feature 중복 #4217/#5053). `.dna` 테스트는 실패 케이스 하나뿐이고 feature 좌표 변환은 목업으로만 검증 → **Biopython 연동이 한 줄도 실행된 적 없음**. 추가 약점: 다중 파트 feature는 min/max로 뭉개져 인트론 포함, strand 무시, 같은 label 2개면 하드 에러. **예상 질문**: "그러면 SnapGene 파일로는 한 번도 안 돌려 봤다는 거죠?"
- **테스트가 지키는 것은 좌표 기하학뿐.** 대상 서열은 전부 의사난수, 데모 plasmid도 합성 서열(GC 50.3%, T7·EGFP·AmpR·pUC ori·lacZ 모티프 전부 미포함). **데모의 `M13-F` 서열 `CGGGTGCGCTCGTAGTGATC`는 실제 M13 forward `GTAAAACGACGGCCAGT`와 전혀 다름**(실측 재확인). `calc_tm`/`pytest.approx` 단언 0건. feature 좌표 변환은 손으로 만든 가짜 객체로만 검증(`tests/test_readers.py:132-159`) — 표준 mock 라이브러리는 안 쓰지만 실제 Biopython 연동은 한 줄도 실행된 적 없음. `test_read_window_matches_documented_example`은 docstring이 스스로 "설계 문서:"라 밝히듯 문서의 산술을 굳힌 것. 반대로 두꺼운 영역: 원형 좌표 wrap, 이음매 판정, 동명 primer 미병합, 막대 마지막 칸 손실. **예상 질문**: "M13-F 서열이 이게 아닌데요?"
- **성능 한계가 커버리지 조합에 몰림.** 실측: `core.recommend`는 60kb × primer 400개에 0.10초. `coverage.plan`은 15kb × 후보 200개에 1.1초, **120kb × 후보 400개에 17.1초**. 원인은 O(후보수 × 목표길이)이고 `contains`가 호출마다 세그먼트 리스트를 새로 생성. `--region`을 안 주면 이 최악 경로가 기본값. **예상 질문**: "genome이나 큰 BAC에도 쓸 수 있나요?"
- **코드가 인정한 한계 원문** — `coverage.py:120-124` `"Not guaranteed to be the smallest possible set, but close in practice"`; `cli.py:332` "이론상 최소는 아닐 수 있습니다"; `cli.py:20-23` `"imply a precision that is not there"`; `design.py:86-88` `"A GC clamp is a preference, not a requirement"`; `design.py:22-24` `"primer3's own defaults are PCR defaults"`; 구현 노트 "**20이라는 값의 근거는 약합니다.**" **불일치 발견**: `design.py:39-41`은 "구조·특이성 탈락 개수는 조건부이며 the screen says so"라 적었으나 실제 화면(`cli.py:390-400`)과 README:111에 그 단서가 없음.

### domain

Sanger 시퀀싱용 primer 선정·설계의 통용 기준값을 조사했다.

- **핵심 개념** — CRL(Continuous Read Length)/Q20: 업체의 "800 bases"는 총 염기 수가 아니라 "QV 20 이상이 끊기지 않는 최장 구간"(https://blog.genewiz.com/analyzing-sanger-sequencing-data). `PRIMER_SEQUENCING_LEAD`: 이 도구의 "dead zone"에 해당하는 Primer3 1급 파라미터, 기본값 50(https://primer3.ut.ee/primer3web_help.htm). `minPerfect`: UCSC In-Silico PCR의 3' 앵커 파라미터명.
- **앵커 13** — UCSC `minPerfect` 기본값 **15**, SnapGene 설정 범위 **8~35**, Geneious off-target 판정은 "3' 첫 4염기 무미스매치 + 전체 미스매치 10% 미만", 문헌 권고 하한 10. 13은 합리적 지점. 다만 4^13 ≈ 6.7×10⁷이라 사람 게놈(3×10⁹)에서는 우연 일치 수십 회 기대 — 게놈 유니크 경계는 16염기. (https://pmc.ncbi.nlm.nih.gov/articles/PMC12469620/ , https://support.snapgene.com/hc/en-us/articles/10383977575828 , https://manual.geneious.com/en/latest/Primers.html)
- **최소 Tm 40도 — 가장 방어가 어려움.** BigDye Terminator v3.1 표준 사이클 96도 10s / **50도 5s** / 60도 4min. McMaster Genomics는 "최소 50도" 요구, GENEWIZ FAQ는 56~60도 권고. 40도는 반응 온도보다 10도 낮음. 단 SnapGene의 "결합 부위 탐지용 최소 Tm" 설정 범위가 10~50도이므로 **탐지 임계값으로서는 범위 안**. (https://tools.thermofisher.com/content/sfs/manuals/cms_081527.pdf , https://genomics.healthsci.mcmaster.ca/services/sanger-sequencing/ , https://www.genewiz.com/public/resources/faqs/faqs-dna-sequencing)
- **100/400 프리셋 — 방어 가능.** Dead zone: Azenta/GENEWIZ "처음 20~40 염기는 해상되지 않음", 관심 부위에서 "최소 60bp, 가급적 100bp" 권고, 최적 해상 구간 100~500. Helsinki "약 50 염기". Read length: Azenta 최대 ~1000/typical 800 Phred20, Macrogen ~1050(Q20 650+), 바이오닉스 ~700bp, ABI 3730xl Q20 700~900. **`moderate`(50/500)가 Primer3 `pick_sequencing_primers`의 LEAD=50, SPACING=500과 정확히 일치** — 최강 근거. (https://blog.genewiz.com/analyzing-sanger-sequencing-data , https://www.helsinki.fi/en/researchgroups/dna-sequencing-and-genomics/instructions-for-sanger-sequencing-0 , https://www.macrogen.com/en/business/research/ces , https://www.bionicsro.co.kr/contents/serviceBasicsequencing)
- **프리셋 비단조성 — 방어 불가.** conservative는 primer 뒤 [100, 500], moderate는 [50, 550], optimistic은 [150, 800]. 포함 관계가 아니라 **100~150 구간이 optimistic에서만 안 읽힘**(conservative와 moderate에서는 읽힘). dead zone과 read length는 물리적으로 독립 축(전기영동 앞부분 해상도 대 뒷부분 신호 감쇠)인데 하나의 다이얼로 묶임. optimistic의 dead zone 150은 시퀀싱 업체 공지값이 아니라 Primavera라는 다른 도구의 기본값에서 온 숫자(`cli.py:27` 주석 `"Primavera 기본값 150~800번"`)이고, 업체 실측은 20~40, 권고 버퍼는 50~100.
- **겹침 20 — 강력한 외부 근거.** Sanger 조립 표준 **Sequencher의 기본 Minimum Overlap이 정확히 20 bases**(Minimum Match 85%). 반면 CAP3 기본 overlap cutoff은 40bp(허용 최소 15). 실무 권고는 큰 insert에서 50~100bp. 리스크: 이음매 20염기가 한쪽 read의 신호 감쇠 구간에 걸리기 쉬움. 표준 실무는 양쪽 가닥 확인. (https://bip.weizmann.ac.il/toolbox/target/dna/sequencher_4.8_tour.pdf , https://www.animalgenome.org/bioinfo/resources/manuals/cap3help.htm)
- **설계 기준 18~24 / 50~60 / 40~60% — 방어 쉬움.** 길이: GENEWIZ 18~24, Yale Keck 18~25, Addgene 18~24(완전 합의). Tm: GENEWIZ 50~60, FAQ 56~60, Yale Keck 50~65, Addgene 50~60(하한 50 합의). GC: GENEWIZ 45~55, Yale Keck 40~60, Addgene 40~60(갈림). 이 도구의 40~60%는 Yale/Addgene와 일치. (https://research.yale.edu/cores/keck-dna/sanger-sequencing-troubleshooting-guide , https://www.addgene.org/protocols/primer-design/)
- **primer3 주석은 절반만 맞음.** Primer3 기본값 MIN_TM 57 / OPT_TM 60 / MAX_TM 63, SIZE 18/20/27, **GC 20~80%**, GC_CLAMP 0, MAX_POLY_X 5. 정정 3가지: ① `PRIMER_TASK=pick_sequencing_primers`라는 시퀀싱 전용 task가 이미 존재하나 그 task도 57~63을 그대로 씀 ② 정확한 표현은 "대부분 버린다"가 아니라 "하한 57이 업체 권고 하한 50~56보다 높아 Tm 50~57 구간을 배제한다" ③ Primer3의 GC 기본값(20~80%)은 이 도구(40~60%)보다 **훨씬 느슨**.
- **미실시 검사 우선순위** — ① template 내 다중 결합(가장 치명적, 이중 ladder로 read 무효화. **재고 primer는 다른 construct용이라 벡터 backbone 반복 요소에 중복 결합할 확률이 신규 설계보다 높음**. 단 이 도구는 이미 `multi-binding`으로 제외 처리함) ② template 하류 난이도(GC-rich/hairpin/homopolymer로 조기 종료 — "400염기를 읽는다"는 가정이 깨지는 주된 실제 원인) ③ 헤어핀/자기이합체(IDT 기준 ΔG > −9 kcal/mol, 3' 관여 시 −5에서도 차단) ④ GC clamp(3' 마지막 5염기에 G/C 1~2개, 3개 초과 금지) ⑤ Poly-N(4~5 연속 초과 금지) ⑥ 게놈 특이성 BLAST. (https://www.idtdna.com/pages/support/faqs/how-can-i-check-my-pcr-primers-using-the-oligoanalyzer-program-to-ensure-there-are-no-significant-primer-design-issues- , http://www.premierbiosoft.com/tech_notes/PCR_Primer_Design.html , https://www.genewiz.com/en/Public/Services/Sanger-Sequencing/Difficult-Template-Sequencing)
- **경쟁 도구 지형.** Primer3: `check_primers`(template 없이 검증)와 `pick_sequencing_primers`(tiling 설계) 보유, **재고 목록에서 고르기는 없음**. NCBI Primer-BLAST: 특이성 중심 설계, 재고 개념 없음. SnapGene: 결합 부위 자동 표시(3' 일치 8~35, 최소 Tm 10~50도)로 이 도구의 판정 엔진과 사실상 동일한 일, **커버리지·타일링 최적화 없음**. Benchling: primer 라이브러리 + 결합 탐지, 설계는 Primer3 백엔드. **Geneious Prime**: `Test with Saved Primers`로 저장된 oligo DB 전체를 template에 테스트하고 off-target site까지 보고, `Design for Sequencing`으로 Sanger용 tiling 설계 → 기능 조합상 가장 근접. 학술: MCMC-ODPR(primer 재사용으로 평균 17.14% 절감)이 있으나 degenerate 멀티플렉스용. **방어 문장**: "Geneious는 재고 테스트와 tiling 설계를 각각 제공하지만, 둘을 결합해 '재고 N개 중 목표 구간을 최소 개수로 덮는 조합'을 자동 계산하지는 않는다." (https://manual.geneious.com/en/latest/Primers.html , https://help.geneious.com/hc/en-us/articles/360045072291 , https://help.benchling.com/hc/en-us/articles/39072057302541 , https://www.ncbi.nlm.nih.gov/tools/primer-blast/search_tips.html , https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3561117/)
- **항목별 방어 판정** — 앵커 13: 조건부 가능(게놈에서 유니크성 부족 인정 필요) / 최소 Tm 40: **취약, 역할 재정의 필요** / 100·400 conservative: 가능 / 프리셋 비단조성: **불가, 수정 권장** / 겹침 20: 조건부 가능(assembly-minimum임을 명시) / 설계 기준 18~24·50~60·40~60%: 쉬움 / primer3 주석: 문구 정정 필요 / 미실시 검사: 선제 선언 필수 / 차별점: 한 줄 답 준비 필요
