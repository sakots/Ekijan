import { useState, useEffect } from 'react';
import { Shuffle, RotateCcw, Trophy, Info } from 'lucide-react';
import "./styles/Tiles.css";

// データセットを読み込む関数
const loadDataset = async () => {
  try {
    const response = await fetch('/dataset.json');
    const data = await response.json();
    return data.tiles;
  } catch (error) {
    console.error('データセット読み込みエラー:', error);
    return [];
  }
};

type Tile = {
  id: string;
  name: string;
  display: string;
  number?: number[];
  wind?: string[];
  dragon?: string[];
  tags?: string[];
  uniqueId: string;
  sort: number;
  dora?: string;  // ドラ表示牌の情報を追加
};

const StationMahjong = () => {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [hand, setHand] = useState<Tile[]>([]);
  const [discards, setDiscards] = useState<Tile[]>([]);
  const [deck, setDeck] = useState<Tile[]>([]);
  const [selectedTiles, setSelectedTiles] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [isRichi, setIsRichi] = useState(false);
  const [doraIndicator, setDoraIndicator] = useState<Tile | null>(null);  // ドラ表示牌の状態

  // 初期化
  useEffect(() => {
    loadDataset().then(data => {
      setTiles(data);
    });
  }, []);

  // デッキの作成（各牌を1枚ずつ）
  const createDeck = () => {
    const newDeck = tiles.map(tile => ({ ...tile, uniqueId: `${tile.id}-0` }));
    const shuffledDeck = shuffleArray(newDeck);
    
    // ドラ表示牌を設定（山札の最後の牌）
    const doraTile = shuffledDeck[shuffledDeck.length - 1];
    setDoraIndicator(doraTile);
    
    // ドラ表示牌を除いた山札を返す
    return shuffledDeck.slice(0, -1);
  };

  // 配列をシャッフル
  const shuffleArray = (array: Tile[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // 手牌を並び替え
  const sortHand = (tiles: Tile[]) => {
    return [...tiles].sort((a, b) => a.sort - b.sort);
  };

  const startGame = () => {
    if (tiles.length === 0) {
      setMessage('データセットを読み込み中...');
      return;
    }

    const newDeck = createDeck();
    const initialHand = sortHand(newDeck.slice(0, 13));
    const remainingDeck = newDeck.slice(13);

    setHand(initialHand);
    setDeck(remainingDeck);
    setDiscards([]);
    setSelectedTiles([]);
    setMessage('ゲーム開始！牌をツモって役を作ろう！');
    setScore(0);
    setGameStarted(true);
  };

  // ツモ
  const drawTile = () => {
    if (deck.length === 0) {
      setMessage('山札がなくなりました！ゲーム終了！');
      return;
    }

    const newTile = deck[0];
    const newDeck = deck.slice(1);
    // 新しい牌を右端に追加（並び替えなし）
    const newHand = [...hand, newTile];

    setHand(newHand);
    setDeck(newDeck);
    setSelectedTiles([]);
    setMessage('牌をツモりました！不要な牌をクリックして捨ててください。');
  };

  // 面子判定（刻子）
  const isKotsu = (tiles: Tile[]): boolean => {
    if (tiles.length !== 3) return false;
    // 同じ数字の駅3枚
    const numbers = tiles.map(t => t.number?.[0]).filter((n): n is number => n !== undefined);
    if (numbers.length === 3 && numbers.every(n => n === numbers[0])) return true;
    // 同じ風牌の駅3枚
    const winds = tiles.map(t => t.wind?.[0]).filter((w): w is string => w !== undefined);
    if (winds.length === 3 && winds.every(w => w === winds[0])) return true;
    // 同じ三元牌の駅3枚
    const dragons = tiles.map(t => t.dragon?.[0]).filter((d): d is string => d !== undefined);
    if (dragons.length === 3 && dragons.every(d => d === dragons[0])) return true;
    // 同じタグの駅3枚（JR、私鉄、地下鉄など）
    const tags = tiles.map(t => t.tags?.find(tag => 
      ['JR', '私鉄', '地下鉄', '◯日市', '◯丁目', '浦和', '八王子', '乗換駅', '直営駅'].includes(tag)
    )).filter((t): t is string => t !== undefined);
    if (tags.length === 3 && tags.every(t => t === tags[0])) return true;
    return false;
  };

  // 面子判定（順子）
  const isShuntsu = (tiles: Tile[]): boolean => {
    if (tiles.length !== 3) return false;
    const numbers = tiles.map(t => t.number?.[0]).filter((n): n is number => n !== undefined);
    if (numbers.length !== 3) return false;
    numbers.sort((a, b) => a - b);
    return numbers[1] === numbers[0] + 1 && numbers[2] === numbers[1] + 1;
  };

  // 雀頭判定
  const isToitsu = (tiles: Tile[]): boolean => {
    if (tiles.length !== 2) return false;
    // 同じ駅名
    if (tiles[0].name === tiles[1].name) return true;
    // 同じ数字
    const numbers = tiles.map(t => t.number?.[0]).filter((n): n is number => n !== undefined);
    if (numbers.length === 2 && numbers[0] === numbers[1]) return true;
    // 同じ風牌
    const winds = tiles.map(t => t.wind?.[0]).filter((w): w is string => w !== undefined);
    if (winds.length === 2 && winds[0] === winds[1]) return true;
    // 同じ三元牌
    const dragons = tiles.map(t => t.dragon?.[0]).filter((d): d is string => d !== undefined);
    if (dragons.length === 2 && dragons[0] === dragons[1]) return true;
    return false;
  };

  // 七対子判定
  const isChitoitsu = (tiles: Tile[]): boolean => {
    if (tiles.length !== 14) return false;
    const pairs: Tile[][] = [];
    const remainingTiles = [...tiles];

    while (remainingTiles.length >= 2) {
      const pair = remainingTiles.splice(0, 2);
      if (!isToitsu(pair)) return false;
      pairs.push(pair);
    }

    return pairs.length === 7;
  };

  // 国士無双判定
  const isKokushimuso = (tiles: Tile[]): boolean => {
    if (tiles.length !== 14) return false;
    const specialTiles = tiles.filter(t =>
      t.number?.[0] === 1 || t.number?.[0] === 9 ||
      t.wind?.[0] || t.dragon?.[0] ||
      t.tags?.some(tag => ['◯日市', '◯丁目', '浦和', '八王子', '乗換駅', '直営駅'].includes(tag))
    );
    return specialTiles.length === 13 && isToitsu([tiles[0], tiles[1]]);
  };

  // 和了判定
  const checkAgari = (tiles: Tile[]): { isAgari: boolean; yaku: string[]; points: number } => {
    if (tiles.length !== 14) return { isAgari: false, yaku: [], points: 0 };

    const yaku: string[] = [];
    let points = 0;

    // ドラの判定
    if (doraIndicator) {
      const doraCount = tiles.filter(tile => {
        // 数字のドラ
        if (doraIndicator.number?.[0] && tile.number?.[0]) {
          const nextNumber = (doraIndicator.number[0] % 9) + 1;
          return tile.number[0] === nextNumber;
        }
        // 風牌のドラ
        if (doraIndicator.wind?.[0] && tile.wind?.[0]) {
          const windOrder = ['東', '南', '西', '北'];
          const currentIndex = windOrder.indexOf(doraIndicator.wind[0]);
          const nextWind = windOrder[(currentIndex + 1) % 4];
          return tile.wind[0] === nextWind;
        }
        // 三元牌のドラ
        if (doraIndicator.dragon?.[0] && tile.dragon?.[0]) {
          const dragonOrder = ['白', '発', '中'];
          const currentIndex = dragonOrder.indexOf(doraIndicator.dragon[0]);
          const nextDragon = dragonOrder[(currentIndex + 1) % 3];
          return tile.dragon[0] === nextDragon;
        }
        // 特別なドラ（dataset.jsonのdoraフィールド）
        if (doraIndicator.dora && tile.name === doraIndicator.dora) {
          return true;
        }
        return false;
      }).length;

      if (doraCount > 0) {
        yaku.push(`ドラ${doraCount}枚`);
        points += doraCount * 100;
      }
    }

    // 七対子判定
    if (isChitoitsu(tiles)) {
      yaku.push('七対子');
      points += 2000;
      return { isAgari: true, yaku, points };
    }

    // 国士無双判定
    if (isKokushimuso(tiles)) {
      yaku.push('国士無双');
      points += 4000;
      return { isAgari: true, yaku, points };
    }

    // 通常和了判定
    const remainingTiles = [...tiles];
    const mentsu: Tile[][] = [];

    // 雀頭を探す
    for (let i = 0; i < remainingTiles.length - 1; i++) {
      for (let j = i + 1; j < remainingTiles.length; j++) {
        const pair = [remainingTiles[i], remainingTiles[j]];
        if (isToitsu(pair)) {
          const newRemaining = remainingTiles.filter((_, idx) => idx !== i && idx !== j);

          // 面子を探す
          const findMentsu = (tiles: Tile[]): boolean => {
            if (tiles.length === 0) return true;
            if (tiles.length < 3) return false;

            // 刻子を探す
            for (let i = 0; i < tiles.length - 2; i++) {
              for (let j = i + 1; j < tiles.length - 1; j++) {
                for (let k = j + 1; k < tiles.length; k++) {
                  const kotsu = [tiles[i], tiles[j], tiles[k]];
                  if (isKotsu(kotsu)) {
                    const newTiles = tiles.filter((_, idx) => idx !== i && idx !== j && idx !== k);
                    if (findMentsu(newTiles)) {
                      mentsu.push(kotsu);
                      return true;
                    }
                  }
                }
              }
            }

            // 順子を探す
            for (let i = 0; i < tiles.length - 2; i++) {
              for (let j = i + 1; j < tiles.length - 1; j++) {
                for (let k = j + 1; k < tiles.length; k++) {
                  const shuntsu = [tiles[i], tiles[j], tiles[k]];
                  if (isShuntsu(shuntsu)) {
                    const newTiles = tiles.filter((_, idx) => idx !== i && idx !== j && idx !== k);
                    if (findMentsu(newTiles)) {
                      mentsu.push(shuntsu);
                      return true;
                    }
                  }
                }
              }
            }

            return false;
          };

          if (findMentsu(newRemaining)) {
            // 役を判定
            for (const m of mentsu) {
              if (isKotsu(m)) {
                const numbers = m.map(t => t.number?.[0]).filter((n): n is number => n !== undefined);
                if (numbers.length === 3) {
                  yaku.push(`刻子（${numbers[0]}）`);
                  points += 100;
                }
                const winds = m.map(t => t.wind?.[0]).filter((w): w is string => w !== undefined);
                if (winds.length === 3) {
                  yaku.push(`風牌刻子（${winds[0]}）`);
                  points += 200;
                }
                const dragons = m.map(t => t.dragon?.[0]).filter((d): d is string => d !== undefined);
                if (dragons.length === 3) {
                  yaku.push(`三元牌刻子（${dragons[0]}）`);
                  points += 300;
                }
                const tags = m.map(t => t.tags?.find(tag => 
                  ['JR', '私鉄', '地下鉄', '◯日市', '◯丁目', '浦和', '八王子', '乗換駅', '直営駅'].includes(tag)
                )).filter((t): t is string => t !== undefined);
                if (tags.length === 3) {
                  yaku.push(`${tags[0]}刻子`);
                  points += 250;
                }
              } else if (isShuntsu(m)) {
                const numbers = m.map(t => t.number?.[0]).filter((n): n is number => n !== undefined);
                if (numbers.length === 3) {
                  yaku.push(`順子（${numbers.join('-')}）`);
                  points += 150;
                }
              }
            }

            if (yaku.length > 0) {
              if (isRichi) {
                yaku.push('リーチ');
                points += 1000;
              }
              return { isAgari: true, yaku, points };
            }
          }
        }
      }
    }

    return { isAgari: false, yaku: [], points: 0 };
  };

  // 役判定
  const checkYaku = () => {
    if (selectedTiles.length < 3) {
      setMessage('3枚以上選択してください。');
      return;
    }

    const selected = hand.filter(t => selectedTiles.includes(t.uniqueId));
    let yakuFound = false;
    let points = 0;

    // 同じ数字を含む駅3枚
    if (selected.length === 3) {
      const numbers = selected.map(t => t.number?.[0]).filter((n): n is number => n !== undefined);
      if (numbers.length === 3 && numbers.every(n => n === numbers[0])) {
        yakuFound = true;
        points = 100;
        setMessage(`同じ数字「${numbers[0]}」の組み合わせ！ +${points}点`);
      }
    }

    // 順子（連番）判定
    if (!yakuFound && selected.length === 3) {
      const numbers = selected.map(t => t.number?.[0]).filter((n): n is number => n !== undefined);
      if (numbers.length === 3) {
        numbers.sort((a, b) => a - b);
        if (numbers[1] === numbers[0] + 1 && numbers[2] === numbers[1] + 1) {
          yakuFound = true;
          points = 150;
          setMessage(`順子完成！ ${numbers.join('-')} +${points}点`);
        }
      }
    }

    // 同じ風牌を含む駅3枚
    if (!yakuFound && selected.length === 3) {
      const winds = selected.map(t => t.wind?.[0]).filter((w): w is string => w !== undefined);
      if (winds.length === 3 && winds.every(w => w === winds[0])) {
        yakuFound = true;
        points = 200;
        setMessage(`風牌「${winds[0]}」の組み合わせ！ +${points}点`);
      }
    }

    // 同じ三元牌を含む駅3枚
    if (!yakuFound && selected.length === 3) {
      const dragons = selected.map(t => t.dragon?.[0]).filter((d): d is string => d !== undefined);
      if (dragons.length === 3 && dragons.every(d => d === dragons[0])) {
        yakuFound = true;
        points = 300;
        setMessage(`三元牌「${dragons[0]}」の組み合わせ！ +${points}点`);
      }
    }

    // 路線系の役
    if (!yakuFound && selected.length === 3) {
      // JR系
      if (selected.every(t => t.tags && t.tags.includes('JR'))) {
        const jrCompany = selected.map(t => t.tags!.find(tag => tag.startsWith('JR')));
        if (jrCompany.every(company => company === jrCompany[0]) && jrCompany[0]) {
          yakuFound = true;
          points = 250;
          setMessage(`JR${jrCompany[0].replace('JR', '')}シリーズ！ +${points}点`);
        }
      }
      // 私鉄系
      else if (selected.every(t => t.tags && t.tags.includes('私鉄'))) {
        const privateRailways = selected.map(t => t.tags?.find(tag =>
          ['東急電鉄', '京王電鉄', '西武鉄道', '東武鉄道', '近畿日本鉄道', '阪急電鉄', '阪神電気鉄道', '名古屋鉄道'].includes(tag)
        )).filter((t): t is string => t !== undefined);
        if (privateRailways.length === 3 && privateRailways.every(company => company === privateRailways[0])) {
          yakuFound = true;
          points = 250;
          setMessage(`${privateRailways[0]}シリーズ！ +${points}点`);
        }
      }
      // 地下鉄系
      else if (selected.every(t => t.tags && t.tags.includes('地下鉄'))) {
        const subwayCompanies = selected.map(t => t.tags?.find(tag =>
          ['東京メトロ', 'Osaka Metro', '名古屋市交通局', '京都市交通局', '福岡市交通局', '仙台市交通局', '札幌市交通局'].includes(tag)
        )).filter((t): t is string => t !== undefined);
        if (subwayCompanies.length === 3 && subwayCompanies.every(company => company === subwayCompanies[0])) {
          yakuFound = true;
          points = 250;
          setMessage(`${subwayCompanies[0]}シリーズ！ +${points}点`);
        }
      }
    }

    // 地域系の役
    if (!yakuFound && selected.length === 3) {
      const prefectures = selected.map(t => t.tags?.find(tag =>
        ['東京都', '大阪府', '京都府', '北海道', '福岡県', '愛知県', '神奈川県', '埼玉県', '千葉県', '兵庫県', '広島県', '新潟県', '宮城県', '福島県', '岩手県', '青森県', '秋田県', '山形県', '栃木県', '群馬県', '茨城県', '静岡県', '山梨県', '長野県', '岐阜県', '三重県', '滋賀県', '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '山口県', '徳島県', '香川県', '愛媛県', '高知県', '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'].includes(tag)
      )).filter((t): t is string => t !== undefined);
      if (prefectures.length === 3 && prefectures.every(pref => pref === prefectures[0])) {
        yakuFound = true;
        points = 200;
        setMessage(`${prefectures[0]}シリーズ！ +${points}点`);
      }
    }

    // 駅タイプ系の役
    if (!yakuFound && selected.length === 3) {
      const stationTypes = selected.map(t => t.tags?.find(tag =>
        ['地上駅', '地下駅', '高架駅', '橋上駅'].includes(tag)
      )).filter((t): t is string => t !== undefined);
      if (stationTypes.length === 3 && stationTypes.every(type => type === stationTypes[0])) {
        yakuFound = true;
        points = 150;
        setMessage(`${stationTypes[0]}シリーズ！ +${points}点`);
      }
    }

    // 文字数系の役
    if (!yakuFound && selected.length === 3) {
      const charCounts = selected.map(t => t.tags?.find(tag =>
        ['2文字', '3文字', '4文字', '5文字', '6文字', '7文字以上'].includes(tag)
      )).filter((t): t is string => t !== undefined);
      if (charCounts.length === 3 && charCounts.every(count => count === charCounts[0])) {
        yakuFound = true;
        points = 150;
        setMessage(`${charCounts[0]}シリーズ！ +${points}点`);
      }
    }

    // 特別役：◯日市の駅3枚
    if (!yakuFound && selected.length === 3) {
      if (selected.every(t => t.tags && t.tags.includes('◯日市'))) {
        yakuFound = true;
        points = 250;
        setMessage(`特別役「◯日市」シリーズ！ +${points}点`);
      }
    }

    // 特別役：◯丁目の駅3枚
    if (!yakuFound && selected.length === 3) {
      if (selected.every(t => t.tags && t.tags.includes('◯丁目'))) {
        yakuFound = true;
        points = 250;
        setMessage(`特別役「◯丁目」シリーズ！ +${points}点`);
      }
    }

    // 特別役：浦和シリーズ
    if (!yakuFound && selected.length === 3) {
      if (selected.every(t => t.tags && t.tags.includes('浦和'))) {
        yakuFound = true;
        points = 300;
        setMessage(`特別役「浦和」シリーズ！ +${points}点`);
      }
    }

    // 特別役：八王子シリーズ
    if (!yakuFound && selected.length === 3) {
      if (selected.every(t => t.tags && t.tags.includes('八王子'))) {
        yakuFound = true;
        points = 300;
        setMessage(`特別役「八王子」シリーズ！ +${points}点`);
      }
    }

    // 特別役：乗換駅シリーズ
    if (!yakuFound && selected.length === 3) {
      if (selected.every(t => t.tags && t.tags.includes('乗換駅'))) {
        yakuFound = true;
        points = 350;
        setMessage(`特別役「乗換駅」シリーズ！ +${points}点`);
      }
    }

    // 特別役：直営駅シリーズ
    if (!yakuFound && selected.length === 3) {
      if (selected.every(t => t.tags && t.tags.includes('直営駅'))) {
        yakuFound = true;
        points = 300;
        setMessage(`特別役「直営駅」シリーズ！ +${points}点`);
      }
    }

    if (yakuFound) {
      setScore(score + points);
      // 役が成立したら、選択した牌を手牌から除外
      const newHand = hand.filter(t => !selectedTiles.includes(t.uniqueId));
      setHand(newHand);
      setSelectedTiles([]);
    } else {
      setMessage('役が成立しません。');
    }
  };

  // リーチ宣言
  const declareRichi = () => {
    if (hand.length === 13 && !isRichi) {
      setIsRichi(true);
      setMessage('リーチ宣言！');
    }
  };

  // 牌を捨てる処理を修正
  const handleTileClick = (tileId: string) => {
    // 14枚以上ある場合のみ捨て牌モード
    if (hand.length <= 13) {
      // 選択モード
      setSelectedTiles(prev => 
        prev.includes(tileId) 
          ? prev.filter(id => id !== tileId)
          : [...prev, tileId]
      );
      return;
    }

    // 捨て牌モード
    const tileIndex = hand.findIndex(t => t.uniqueId === tileId);
    if (tileIndex === -1) return;
    
    const discardedTile = hand[tileIndex];
    // 捨て牌後は並び替え
    const newHand = sortHand(hand.filter((_, index) => index !== tileIndex));
    
    // 和了判定
    const agariResult = checkAgari(newHand);
    if (agariResult.isAgari) {
      setMessage(`和了！\n役: ${agariResult.yaku.join(', ')}\n点数: +${agariResult.points}点`);
      setScore(score + agariResult.points);
      setHand([]);
      setDiscards([...discards, discardedTile]);
      setGameStarted(false);
      return;
    }
    
    const newDiscards = [...discards, discardedTile];
    setHand(newHand);
    setDiscards(newDiscards);
    setSelectedTiles([]);
    setMessage('牌を捨てました。次の牌をツモってください。');
  };

  // 牌の表示コンポーネント
  type TileComponentProps = {
    tile: Tile;
    isSelected?: boolean;
    onClick?: () => void;
    size?: 'normal' | 'small';
    isDiscardMode?: boolean;
    isDoraIndicator?: boolean;
  };

  const TileComponent = ({ tile, isSelected = false, onClick, size = 'normal', isDiscardMode = false, isDoraIndicator = false }: TileComponentProps) => {
    const isDiscardable = isDiscardMode && hand.length > 13;
    return (
      <div
        onClick={onClick}
        className={`tile ${size} ${isSelected ? 'selected' : ''} ${isDiscardable ? 'discard-mode' : ''} ${isDoraIndicator ? 'dora-indicator' : ''}`}
      >
        <div className="tile-content">
          <div className="tile-name" dangerouslySetInnerHTML={{ __html: tile.display }} />
          {tile.tags && tile.tags.length > 0 && (
            <div className="tile-tags">
              {tile.tags.slice(0, 2).join('・')}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setShowRules(!showRules)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
            >
              <Info size={20} />
              ルール
            </button>
            <button
              onClick={startGame}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center gap-2"
            >
              {gameStarted ? <RotateCcw size={20} /> : <Shuffle size={20} />}
              {gameStarted ? 'リセット' : 'ゲーム開始'}
            </button>
          </div>
        </div>

        {showRules && (
          <div className="bg-white rounded p-4 mb-4 shadow">
            <h3 className="font-bold mb-2">遊び方</h3>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>駅名に含まれる数字（一〜九）、風牌（東南西北）、三元牌（白発中）で役を作ります</li>
              <li>同じ数字を含む駅3枚（例：一ノ宮、一乗谷、尾張一宮）: 100点</li>
              <li>順子（連番3枚 例:一-二-三）: 150点</li>
              <li>同じ風牌を含む駅3枚（例：東三条、東浦和、東雲）: 200点</li>
              <li>同じ三元牌を含む駅3枚（例：白梅町、新白島、目白）: 300点</li>
              <li>特別役「◯日市」シリーズ: 250点</li>
              <li>特別役「◯丁目」シリーズ: 250点</li>
              <li>特別役「浦和」「八王子」シリーズ: 300点</li>
              <li>各駅は1枚ずつなので、同じ駅は出ません！</li>
              <li>14枚になったら、手牌を直接クリックして捨てられます（赤くハイライト）</li>
            </ul>
          </div>
        )}

        {gameStarted && (
          <>
            <div className="bg-white rounded-lg p-4 mb-4 shadow">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold">スコア: {score}点</h2>
                <div className="text-sm text-gray-600">
                  山札: {deck.length}枚 | 手牌: {hand.length}枚
                </div>
              </div>
              {doraIndicator && (
                <div className="mb-2">
                  <h3 className="text-sm font-semibold text-gray-600">ドラ表示牌:</h3>
                  <div className="inline-block">
                    <TileComponent
                      tile={doraIndicator}
                      size="small"
                      isDoraIndicator={true}
                    />
                  </div>
                </div>
              )}
              <p className={`text-sm ${message.includes('完成') ? 'text-green-600 font-bold' : 'text-gray-700'}`}>
                {message}
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 mb-4 shadow">
              <h3 className="font-semibold mb-2">手牌</h3>
              {hand.length > 13 && (
                <div className="mb-2 text-sm text-red-600 font-semibold">
                  ※ 牌をクリックして1枚捨ててください
                </div>
              )}
              <div className="tile-container hand">
                {hand.map((tile) => (
                  <TileComponent
                    key={tile.uniqueId}
                    tile={tile}
                    isSelected={hand.length <= 13 && selectedTiles.includes(tile.uniqueId)}
                    onClick={() => handleTileClick(tile.uniqueId)}
                    isDiscardMode={hand.length > 13}
                  />
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={drawTile}
                  disabled={hand.length >= 14}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
                >
                  ツモる
                </button>
                <button
                  onClick={checkYaku}
                  disabled={selectedTiles.length < 3 || hand.length > 13}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
                >
                  役判定
                </button>
                <button
                  onClick={declareRichi}
                  disabled={hand.length !== 13 || isRichi}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:bg-gray-400"
                >
                  リーチ
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow">
              <h3 className="font-semibold mb-2">捨て牌</h3>
              <div className="tile-container discards">
                {discards.map((tile, index) => (
                  <TileComponent
                    key={`discard-${index}`}
                    tile={tile}
                    size="small"
                    isSelected={false}
                    onClick={() => {}}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {!gameStarted && (
          <div className="text-center py-12">
            <Trophy className="mx-auto mb-4 text-green-600" size={64} />
            <p className="text-lg text-gray-700">
              「ゲーム開始」ボタンを押して駅名麻雀を始めよう！
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StationMahjong;