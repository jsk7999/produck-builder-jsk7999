import { Recipe } from "./types";

export const recipesData: Recipe[] = [
  {
    id: "kimchi-jjigae",
    name: "김치찌개",
    engName: "Kimchi Jjigae",
    category: "찌개 / 국",
    description: "잘 익은 신김치와 돼지고기 또는 참치를 듬뿍 넣어 얼큰하고 깊은 맛을 내는 한국의 대표 찌개 요리입니다. 한식 밥상의 든든한 동반자로, 푹 끓여낼수록 풍미가 깊어집니다.",
    prepTimeMin: 10,
    cookTimeMin: 20,
    difficulty: "보통",
    baseServings: 2,
    tags: ["얼큰함", "밥도둑", "전통한식", "해장"],
    variations: [
      {
        id: "pork",
        name: "돼지고기 김치찌개 (기본)",
        description: "고소한 돼지고기 삼겹살이나 목살을 신김치와 함께 볶아 깊고 진한 기름맛이 우러나는 가장 클래식한 김치찌개입니다.",
        ingredients: [
          { name: "신김치 (적당히 익은 것)", baseAmount: 150, unit: "g", category: "주재료" },
          { name: "돼지고기 (삼겹살 또는 목살)", baseAmount: 100, unit: "g", category: "주재료" },
          { name: "두부", baseAmount: 50, unit: "g", category: "부재료" },
          { name: "대파", baseAmount: 0.25, unit: "대", category: "부재료" },
          { name: "청양고추", baseAmount: 0.5, unit: "개", category: "부재료" },
          { name: "다진 마늘", baseAmount: 0.5, unit: "큰술", category: "양념" },
          { name: "고춧가루", baseAmount: 0.75, unit: "큰술", category: "양념" },
          { name: "국간장", baseAmount: 0.5, unit: "큰술", category: "양념" },
          { name: "새우젓 (또는 멸치액젓)", baseAmount: 0.25, unit: "큰술", category: "양념" },
          { name: "들기름 (또는 식용유)", baseAmount: 0.5, unit: "큰술", category: "양념" },
          { name: "멸치 육수 (또는 쌀뜨물)", baseAmount: 250, unit: "ml", category: "육수" }
        ]
      },
      {
        id: "tuna",
        name: "참치 김치찌개",
        description: "기름을 뺀 참치캔을 사용하여 국물이 텁텁하지 않고 담백하며 시원한 맛이 특징인 누구나 좋아하는 초간단 김치찌개입니다.",
        ingredients: [
          { name: "신김치 (적당히 익은 것)", baseAmount: 150, unit: "g", category: "주재료" },
          { name: "캔참치", baseAmount: 75, unit: "g", category: "주재료" },
          { name: "두부", baseAmount: 50, unit: "g", category: "부재료" },
          { name: "대파", baseAmount: 0.25, unit: "대", category: "부재료" },
          { name: "양파", baseAmount: 0.25, unit: "개", category: "부재료" },
          { name: "다진 마늘", baseAmount: 0.5, unit: "큰술", category: "양념" },
          { name: "고춧가루", baseAmount: 0.5, unit: "큰술", category: "양념" },
          { name: "설탕 (김치 신맛 조절용)", baseAmount: 0.25, unit: "작은술", category: "양념" },
          { name: "들기름", baseAmount: 0.5, unit: "큰술", category: "양념" },
          { name: "쌀뜨물 (또는 물)", baseAmount: 250, unit: "ml", category: "육수" }
        ]
      },
      {
        id: "vegetarian",
        name: "비건 두부 버섯 김치찌개",
        description: "고기나 해산물 대신 표고버섯과 팽이버섯으로 감칠맛을 내고 두부를 넉넉히 넣어 깔끔하면서도 깊은 풍미를 가진 건강식 김치찌개입니다.",
        ingredients: [
          { name: "신김치 (젓갈 무첨가 비건 김치)", baseAmount: 150, unit: "g", category: "주재료" },
          { name: "표고버섯", baseAmount: 1, unit: "개", category: "주재료" },
          { name: "팽이버섯", baseAmount: 0.25, unit: "봉지", category: "주재료" },
          { name: "두부", baseAmount: 100, unit: "g", category: "부재료" },
          { name: "대파", baseAmount: 0.25, unit: "대", category: "부재료" },
          { name: "양파", baseAmount: 0.25, unit: "개", category: "부재료" },
          { name: "다진 마늘", baseAmount: 0.5, unit: "큰술", category: "양념" },
          { name: "고춧가루", baseAmount: 0.75, unit: "큰술", category: "양념" },
          { name: "국간장 (또는 연두/비건액젓)", baseAmount: 0.75, unit: "큰술", category: "양념" },
          { name: "들기름", baseAmount: 0.5, unit: "큰술", category: "양념" },
          { name: "채수 (다시마, 표고버섯 우린 물)", baseAmount: 250, unit: "ml", category: "육수" }
        ]
      }
    ],
    // Default ingredients (Pork version is default)
    ingredients: [
      { name: "신김치 (적당히 익은 것)", baseAmount: 150, unit: "g", category: "주재료" },
      { name: "돼지고기 (삼겹살 또는 목살)", baseAmount: 100, unit: "g", category: "주재료" },
      { name: "두부", baseAmount: 50, unit: "g", category: "부재료" },
      { name: "대파", baseAmount: 0.25, unit: "대", category: "부재료" },
      { name: "청양고추", baseAmount: 0.5, unit: "개", category: "부재료" },
      { name: "다진 마늘", baseAmount: 0.5, unit: "큰술", category: "양념" },
      { name: "고춧가루", baseAmount: 0.75, unit: "큰술", category: "양념" },
      { name: "국간장", baseAmount: 0.5, unit: "큰술", category: "양념" },
      { name: "새우젓 (또는 멸치액젓)", baseAmount: 0.25, unit: "큰술", category: "양념" },
      { name: "들기름 (또는 식용유)", baseAmount: 0.5, unit: "큰술", category: "양념" },
      { name: "멸치 육수 (또는 쌀뜨물)", baseAmount: 250, unit: "ml", category: "육수" }
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: "신김치는 한입 크기(약 2~3cm 너비)로 썰고, 돼지고기(또는 대체 재료) 역시 먹기 좋은 크기로 썰어 준비합니다.",
        tip: "김치가 너무 시다면 설탕을 1/2작은술 정도 넣어 버무려 두면 신맛이 완화됩니다.",
        durationSec: 120
      },
      {
        stepNumber: 2,
        instruction: "두부는 1cm 두께로 직사각형 모양으로 썰고, 대파와 청양고추는 어슷썰기합니다. 버섯류는 밑동을 자르고 가닥가닥 찢어 둡니다.",
        tip: "대파와 고추를 어슷하게 썰면 국물이 잘 우러나고 시각적으로도 좋습니다.",
        durationSec: 180
      },
      {
        stepNumber: 3,
        instruction: "냄비를 중불로 예열한 뒤 들기름(또는 식용유) 1큰술을 두르고 썰어둔 돼지고기와 신김치를 함께 넣고 볶습니다.",
        tip: "김치 숨이 죽고 돼지고기 표면이 하얗게 익어 고소한 기름이 나올 때까지 3~4분 충분히 볶아주어야 깊은 맛이 납니다.",
        durationSec: 240
      },
      {
        stepNumber: 4,
        instruction: "김치와 고기가 충분히 볶아지면 고춧가루 1.5큰술을 넣고 가볍게 30초간 더 볶아 고추기름을 낸 뒤, 준비해 둔 멸치 육수(또는 쌀뜨물) 500ml를 붓습니다.",
        tip: "고춧가루가 타지 않도록 불을 약하게 줄이거나 육수를 붓기 직전에 빠르게 볶아야 합니다. 쌀뜨물을 쓰면 전분기 덕분에 국물이 걸쭉하고 담백해집니다.",
        durationSec: 90
      },
      {
        stepNumber: 5,
        instruction: "육수를 부은 찌개를 센 불로 올려 끓이기 시작합니다. 국물이 팔팔 끓어오르면 다진 마늘 1큰술, 국간장 1큰술을 넣고 불을 중약불로 줄여 10분간 푹 끓입니다.",
        tip: "김치찌개는 뚜껑을 덮고 은근한 불에 오래 끓여 김치가 야들야들해져야 가장 맛있습니다.",
        durationSec: 600
      },
      {
        stepNumber: 6,
        instruction: "김치가 부드러워지면 준비한 두부, 대파, 청양고추를 넣고 3분간 더 끓입니다. 마지막으로 간을 보고 싱거우면 새우젓이나 액젓을 약간 넣어 최종 간을 맞춥니다.",
        tip: "새우젓을 사용하여 간을 맞추면 소금이나 간장만 썼을 때보다 감칠맛과 시원한 맛이 배가됩니다.",
        durationSec: 180
      }
    ],
    tips: [
      "신김치 사용하기: 김치찌개의 맛은 80%가 김치 자체의 신맛과 숙성도에 결정됩니다. 익지 않은 김치로 끓일 경우 식초를 1/2큰술 넣으면 신김치와 유사한 맛을 낼 수 있습니다.",
      "불 조절의 미학: 처음 볶을 때는 강한 중불, 육수를 부어 끓어오른 뒤에는 중약불로 줄여 은근히 끓이는 것이 재료의 맛을 국물에 우려내는 정석적인 방법입니다.",
      "식감 살리기: 두부와 대파는 조리 마지막 단계에 넣어야 형태가 으깨지지 않고 파의 향긋함과 두부의 부드러운 식감을 온전히 느낄 수 있습니다."
    ]
  },
  {
    id: "doenjang-jjigae",
    name: "된장찌개",
    engName: "Doenjang Jjigae",
    category: "찌개 / 국",
    description: "구수한 재래식 된장 베이스에 애호박, 두부, 버섯을 풍성하게 넣어 자글자글 끓여내는 한국인의 소울푸드입니다. 구수하고 짭조름한 국물은 밥과 비벼 먹을 때 최고의 조화를 이룹니다.",
    prepTimeMin: 10,
    cookTimeMin: 15,
    difficulty: "쉬움",
    baseServings: 2,
    tags: ["구수함", "소울푸드", "매일집밥", "웰빙"],
    ingredients: [
      { name: "애호박", baseAmount: 0.25, unit: "개", category: "주재료" },
      { name: "두부", baseAmount: 60, unit: "g", category: "주재료" },
      { name: "표고버섯 (또는 느타리버섯)", baseAmount: 0.5, unit: "개", category: "주재료" },
      { name: "양파", baseAmount: 0.25, unit: "개", category: "부재료" },
      { name: "대파", baseAmount: 0.25, unit: "대", category: "부재료" },
      { name: "청양고추", baseAmount: 0.5, unit: "개", category: "부재료" },
      { name: "된장", baseAmount: 1.5, unit: "큰술", category: "양념" },
      { name: "고춧가루", baseAmount: 0.25, unit: "큰술", category: "양념" },
      { name: "다진 마늘", baseAmount: 0.25, unit: "큰술", category: "양념" },
      { name: "멸치다시마 육수", baseAmount: 250, unit: "ml", category: "육수" }
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: "애호박과 양파는 사방 1.5cm 크기로 한입에 먹기 좋게 썰고, 표고버섯도 비슷한 크기로 편 썰어줍니다. 두부는 깍둑썰기하고 대파와 청양고추는 송송 썹니다.",
        tip: "모든 재료를 비슷한 크기로 썰어야 숟가락으로 떠먹기 편리합니다.",
        durationSec: 150
      },
      {
        stepNumber: 2,
        instruction: "뚝배기나 냄비에 멸치다시마 육수 500ml를 붓고 끓입니다. 육수가 끓어오르면 불을 줄이고 된장 3큰술을 체에 걸러 곱게 풀어줍니다.",
        tip: "된장을 체에 걸러 풀면 찌개 국물이 텁텁하지 않고 깔끔해집니다.",
        durationSec: 120
      },
      {
        stepNumber: 3,
        instruction: "된장 국물에 딱단한 채소인 양파, 애호박, 표고버섯을 먼저 넣고 센 불에서 한소끔 끓입니다.",
        tip: "호박이 반투명하게 익기 시작할 때까지 3~4분간 끓여 채소의 단맛이 국물에 우러나게 합니다.",
        durationSec: 240
      },
      {
        stepNumber: 4,
        instruction: "채소가 어느 정도 익으면 두부와 다진 마늘 0.5큰술, 고춧가루 0.5큰술을 넣고 불을 중불로 줄여 3분간 더 끓여냅니다.",
        tip: "고춧가루를 아주 소량 넣으면 된장의 쿰쿰한 맛을 잡아주고 칼칼한 끝맛을 더해줍니다.",
        durationSec: 180
      },
      {
        stepNumber: 5,
        instruction: "마지막으로 송송 썬 대파와 청양고추를 올려 한소끔만 더 파르르 끓인 후 불을 끕니다.",
        tip: "청양고추는 불을 끄기 직전에 넣어야 매콤하고 알싸한 칼칼함이 깔끔하게 유지됩니다.",
        durationSec: 60
      }
    ],
    tips: [
      "된장 고르기: 집된장(재래식)과 시판 찌개용 된장을 1:1 비율로 섞어 쓰면 시판 된장의 단맛과 집된장의 깊은 맛이 어우러져 가장 완벽한 찌개 맛을 낼 수 있습니다.",
      "쌀뜨물 활용: 멸치 육수 대신 쌀을 씻을 때 두세 번째 나오는 쌀뜨물을 사용하면 된장의 전분 성분과 잘 결합하여 걸쭉하고 부드러운 된장찌개가 됩니다.",
      "차돌박이 추가: 더 든든하게 먹고 싶다면 찌개를 끓이기 시작할 때 차돌박이를 구워 기름을 낸 뒤 찌개를 끓여보세요. 매우 풍성한 고기 된장찌개가 완성됩니다."
    ]
  },
  {
    id: "bulgogi",
    name: "소불고기",
    engName: "Bulgogi",
    category: "고기 요리",
    description: "얇게 썬 소고기를 간장, 설탕, 마늘, 참기름으로 달콤 짭조름하게 양념하여 양파, 대파, 버섯과 함께 볶아내는 한국 최고의 잔치 및 손님 맞이 고기 요리입니다.",
    prepTimeMin: 20,
    cookTimeMin: 10,
    difficulty: "보통",
    baseServings: 2,
    tags: ["달콤짭조름", "단짠단짠", "어린이인기", "잔치요리"],
    ingredients: [
      { name: "소고기 (불고기용 얇은 목심/설도)", baseAmount: 150, unit: "g", category: "주재료" },
      { name: "양파", baseAmount: 0.25, unit: "개", category: "부재료" },
      { name: "대파", baseAmount: 0.25, unit: "대", category: "부재료" },
      { name: "팽이버섯 (또는 느타리버섯)", baseAmount: 0.25, unit: "봉지", category: "부재료" },
      { name: "진간장", baseAmount: 1.5, unit: "큰술", category: "양념" },
      { name: "설탕", baseAmount: 0.5, unit: "큰술", category: "양념" },
      { name: "올리고당 (또는 물엿)", baseAmount: 0.25, unit: "큰술", category: "양념" },
      { name: "다진 마늘", baseAmount: 0.5, unit: "큰술", category: "양념" },
      { name: "맛술 (또는 청주)", baseAmount: 0.5, unit: "큰술", category: "양념" },
      { name: "참기름", baseAmount: 0.5, unit: "큰술", category: "양념" },
      { name: "후춧가루", baseAmount: 0.05, unit: "작은술", category: "양념" },
      { name: "갈아 만든 배 (배즙)", baseAmount: 1.5, unit: "큰술", category: "양념" }
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: "소고기는 키친타월로 가볍게 눌러 핏물을 제거하고, 5~6cm 간격으로 먹기 좋게 썰어 뭉친 고기 가닥들을 가볍게 떼어냅니다.",
        tip: "핏물을 제대로 제거해야 누린내가 나지 않고 깔끔합니다.",
        durationSec: 120
      },
      {
        stepNumber: 2,
        instruction: "양념장 만들기: 볼에 간장, 설탕, 배즙, 맛술, 다진 마늘, 참기름, 후춧가루를 정량대로 섞어 설탕이 완전히 녹을 때까지 저어줍니다.",
        tip: "배즙이나 사과즙을 넣으면 고기 육질이 아주 연해지는 연육 작용을 도우며 고급스러운 단맛이 납니다. 배즙이 없다면 매실청으로 대체해 보세요.",
        durationSec: 180
      },
      {
        stepNumber: 3,
        instruction: "핏물을 뺀 소고기에 만들어둔 양념장을 붓고 손으로 조물조물 버무려 양념이 쏙 배어들도록 합니다. 실온에서 20~30분간 재워둡니다.",
        tip: "시간이 있다면 냉장고에 넣어 반나절 숙성시키면 고기가 훨씬 부드럽고 양념이 골고루 뱁니다.",
        durationSec: 1200
      },
      {
        stepNumber: 4,
        instruction: "고기를 재우는 동안 양파는 채 썰고 대파는 어슷썰기합니다. 팽이버섯은 밑동을 자르고 얇게 찢어 놓습니다.",
        tip: "채소도 고기와 잘 어우러지도록 너무 두껍지 않게 썹니다.",
        durationSec: 180
      },
      {
        stepNumber: 5,
        instruction: "달궈진 팬에 기름을 두르지 않고 재워둔 소고기를 먼저 넣어 강한 불에서 볶기 시작합니다. 고기 표면이 약간 익으면 양파를 먼저 넣어 함께 볶습니다.",
        tip: "불고기는 강한 불에 빠르게 볶아내야 육즙이 빠져나가지 않고 고기가 퍽퍽해지지 않습니다.",
        durationSec: 240
      },
      {
        stepNumber: 6,
        instruction: "고기가 거의 다 익어가면 대파와 팽이버섯을 넣고 야채 숨이 가볍게 죽을 때까지 약 1~2분간 볶아 마무리한 뒤, 통깨를 뿌려 서빙합니다.",
        tip: "마지막에 참기름 반 큰술을 한 바퀴 더 두르면 고소한 풍미가 훌륭해집니다.",
        durationSec: 120
      }
    ],
    tips: [
      "연육 작용의 꿀팁: 고기가 조금 질긴 부위라면 배즙 외에도 키위나 파인애플 간 것을 아주 소량(티스푼의 반 정도) 넣어도 좋습니다. 다만 너무 많이 넣거나 오래 재우면 고기가 녹아 흐물거려지므로 주의하세요.",
      "국물 불고기: 국물이 자작한 서울식 불고기를 원한다면 멸치 육수나 다시마 우린 물 1/2컵을 찌개 주변에 두르고 당면을 미리 불려 넣고 뚝배기에서 끓여 드시면 좋습니다."
    ]
  },
  {
    id: "bibimbap",
    name: "비빔밥",
    engName: "Bibimbap",
    category: "밥 요리",
    description: "갓 지은 흰쌀밥 위에 오색 찬란한 갖가지 나물(도라지, 고사리, 애호박, 당근, 소고기)과 달걀프라이를 올린 뒤, 매콤달콤한 고추장 양념을 얹어 비벼 먹는 영양 만점 한식의 예술입니다.",
    prepTimeMin: 20,
    cookTimeMin: 15,
    difficulty: "어려움",
    baseServings: 2,
    tags: ["영양균형", "비주얼", "외국인기", "건강식"],
    ingredients: [
      { name: "흰쌀밥", baseAmount: 1, unit: "공기", category: "주재료" },
      { name: "소고기 (다진 것)", baseAmount: 40, unit: "g", category: "주재료" },
      { name: "시금치", baseAmount: 50, unit: "g", category: "주재료" },
      { name: "콩나물", baseAmount: 50, unit: "g", category: "주재료" },
      { name: "당근", baseAmount: 0.2, unit: "개", category: "부재료" },
      { name: "애호박", baseAmount: 0.2, unit: "개", category: "부재료" },
      { name: "달걀", baseAmount: 1, unit: "개", category: "부재료" },
      { name: "고추장", baseAmount: 1, unit: "큰술", category: "양념" },
      { name: "매실청", baseAmount: 0.5, unit: "큰술", category: "양념" },
      { name: "참기름", baseAmount: 0.5, unit: "큰술", category: "양념" },
      { name: "통깨", baseAmount: 0.25, unit: "큰술", category: "양념" },
      { name: "국간장 / 소금 / 참기름 (나물 무침용)", baseAmount: 0.5, unit: "큰술", category: "양념" }
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: "콩나물은 끓는 물에 소금을 넣고 삶아 찬물에 헹군 뒤 소금, 참기름, 통깨로 가볍게 무쳐둡니다. 시금치는 끓는 물에 30초간 데쳐 찬물에 헹궈 물기를 꼭 짜고 소금, 참기름, 다진 마늘로 무칩니다.",
        tip: "데친 채소는 물기를 아주 꽉 짜주어야 나중에 비빔밥을 비빌 때 물이 흥건하게 고이지 않습니다.",
        durationSec: 300
      },
      {
        stepNumber: 2,
        instruction: "애호박과 당근은 아주 얇게 채 썰어 줍니다. 팬에 식용유를 두르고 당근을 소금 약간 쳐서 볶아내고, 그 다음 애호박도 소금 약간 쳐서 각각 따로 볶아 한 김 식혀둡니다.",
        tip: "각각의 채소를 따로 볶아내야 각각의 고유한 색상(주황색, 연두색 등)이 섞이지 않고 비빔밥 위에 올렸을 때 화려한 오방색이 완성됩니다.",
        durationSec: 300
      },
      {
        stepNumber: 3,
        instruction: "다진 소고기는 간장 0.5큰술, 설탕 0.25큰술, 다진 마늘 0.25큰술, 참기름으로 밑간하여 팬에 수분이 날아갈 때까지 보슬보슬하게 볶아냅니다.",
        tip: "다진 고기가 뭉치지 않게 젓가락으로 흐트러뜨리며 볶아줍니다.",
        durationSec: 180
      },
      {
        stepNumber: 4,
        instruction: "볶음고추장(약고추장) 만들기: 고추장 2큰술, 매실청 1큰술, 올리고당 0.5큰술, 참기름 1큰술, 다진 마늘 0.5작은술을 잘 섞어 부드럽게 만들어 줍니다.",
        tip: "여기에 다진 소고기 볶은 것을 약간 섞어 한 번 조려내면 엄청나게 맛있는 약고추장이 됩니다.",
        durationSec: 120
      },
      {
        stepNumber: 5,
        instruction: "팬에 식용유를 두르고 달걀을 깨뜨려 노른자가 반숙 상태로 유지되도록 서서히 프라이합니다.",
        tip: "흰자 테두리는 바삭하고 노른자는 톡 터지는 반숙이 비빔밥에 비벼 먹기에 최적입니다.",
        durationSec: 120
      },
      {
        stepNumber: 6,
        instruction: "그릇에 따뜻한 흰쌀밥을 소복하게 담고, 그 위에 준비한 오색 나물(시금치, 콩나물, 애호박, 당근, 소고기 고명)을 정갈하게 방사형으로 둘러 올린 뒤, 중앙에 달걀프라이와 약고추장, 통깨를 얹어 냅니다.",
        tip: "먹기 직전에 참기름 한 큰술을 밥 위에 한 바퀴 추가해 주면 비빔밥의 고소함이 온 사방에 퍼집니다.",
        durationSec: 180
      }
    ],
    tips: [
      "나물 간 맞추기: 비빔밥의 나물들은 고추장에 비벼지기 때문에 평소 반찬으로 먹을 때보다 간을 약간 삼삼하게 무치는 것이 건강하고 비빈 후 간이 딱 맞습니다.",
      "돌솥 비빔밥: 만약 돌솥이나 뚝배기가 있다면 내부에 참기름을 골고루 바르고 밥과 나물을 올려 불 위에서 타닥타닥 소리가 날 때까지 데워 드세요. 밑바닥에 누룽지가 생겨서 별미입니다."
    ]
  },
  {
    id: "tteokbokki",
    name: "떡볶이",
    engName: "Tteokbokki",
    category: "스낵 / 분식",
    description: "쫄깃쫄깃한 쌀떡 또는 밀떡에 감칠맛 나는 매콤달콤한 고추장 육수와 어묵, 양배추, 대파를 듬뿍 넣어 조려내는 한국인의 부동의 1위 국민 분식 길거리 요리입니다.",
    prepTimeMin: 5,
    cookTimeMin: 15,
    difficulty: "쉬움",
    baseServings: 2,
    tags: ["매콤달콤", "쫄깃쫄깃", "국민분식", "길거리"],
    ingredients: [
      { name: "떡볶이 떡 (쌀떡 또는 밀떡)", baseAmount: 150, unit: "g", category: "주재료" },
      { name: "사각어묵", baseAmount: 1, unit: "장", category: "주재료" },
      { name: "대파", baseAmount: 0.5, unit: "대", category: "부재료" },
      { name: "양배추", baseAmount: 30, unit: "g", category: "부재료" },
      { name: "고추장", baseAmount: 1, unit: "큰술", category: "양념" },
      { name: "고춧가루", baseAmount: 0.75, unit: "큰술", category: "양념" },
      { name: "진간장", baseAmount: 0.5, unit: "큰술", category: "양념" },
      { name: "설탕", baseAmount: 1, unit: "큰술", category: "양념" },
      { name: "올리고당 (또는 물엿)", baseAmount: 0.5, unit: "큰술", category: "양념" },
      { name: "멸치다시마 육수 (또는 생수)", baseAmount: 200, unit: "ml", category: "육수" }
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: "떡이 딱딱하다면 미지근한 물에 10분 정도 담가 부드럽게 불려두고 물기를 뺍니다. 사각어묵은 삼각형이나 한입 크기 네모 모양으로 썰고, 양배추는 큼직하게 썰며, 대파는 4cm 길이로 듬뿍 썹니다.",
        tip: "대파를 듬뿍 넣으면 대파 고유의 단맛과 진한 향이 국물에 우러나와 조미료 없이도 훌륭한 맛을 냅니다.",
        durationSec: 180
      },
      {
        stepNumber: 2,
        instruction: "넓고 평평한 팬에 멸치다시마 육수 400ml를 붓고 고추장 2큰술, 고춧가루 1.5큰술, 간장 1큰술, 설탕 2큰술을 넣고 잘 풀어주며 끓입니다.",
        tip: "밀떡은 양념이 빨리 배지만 쌀떡은 조금 오래 졸여야 하므로 불리는 시간과 끓이는 불 조절에 유의합니다.",
        durationSec: 120
      },
      {
        stepNumber: 3,
        instruction: "양념이 끓어오르면 떡을 먼저 넣고 중불에서 떡이 말랑말랑해지고 통통하게 부풀어 오를 때까지 저어가며 끓여줍니다.",
        tip: "떡이 바닥에 붙지 않도록 나무 주걱이나 숟가락으로 살살 밀어가며 저어주어야 합니다.",
        durationSec: 240
      },
      {
        stepNumber: 4,
        instruction: "떡이 쫄깃하게 익으면 어묵, 썰어둔 양배추, 대파를 모두 넣고 불을 조금 줄여 자작하게 국물이 스며들 때까지 졸입니다.",
        tip: "이때 삶은 달걀이나 튀김을 같이 넣어 끓여도 매우 좋습니다.",
        durationSec: 300
      },
      {
        stepNumber: 5,
        instruction: "국물이 걸쭉해지며 양념이 떡과 어묵에 잘 배어들면 불을 끄기 직전에 올리고당 1큰술과 후춧가루 한 꼬집을 넣고 가볍게 섞어 윤기를 내어 그릇에 담아냅니다.",
        tip: "마지막에 후춧가루를 톡톡 넣어주면 포장마차 특유의 입맛 당기는 감칠맛이 연출됩니다.",
        durationSec: 60
      }
    ],
    tips: [
      "황금 비율 단맛: 떡볶이 소스의 비결은 고추장과 설탕의 비율입니다. 단맛은 설탕뿐만 아니라 양배추와 대파가 졸여지면서 자연스럽게 나오는 단맛이 조화를 이루어야 깊이가 생깁니다.",
      "라볶이로 즐기기: 라면 사리를 함께 넣고 싶다면 라면을 다른 냄비에 70%만 먼저 삶아 헹궈 기름을 뺀 뒤, 조리 4단계에 함께 넣고 졸이면 꼬들꼬들한 라볶이가 국물을 다 흡수해버리지 않고 아주 훌륭하게 완성됩니다."
    ]
  }
];
