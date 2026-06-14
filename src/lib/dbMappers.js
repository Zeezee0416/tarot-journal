/** Map DB row → app card shape (merged with user notes) */
export function rowToCard(row, note = {}) {
  return {
    id: row.id,
    name: row.name,
    enName: row.en_name || '',
    number: row.number || '',
    suit: row.suit,
    image: row.image_url || `/cards/${row.id}.jpg`,
    uprightKw: row.upright_kw || '',
    reversedKw: row.reversed_kw || '',
    uprightMeaning: row.upright_meaning || '',
    reversedMeaning: row.reversed_meaning || '',
    loveMeaning: row.love_meaning || '',
    careerMeaning: row.career_meaning || '',
    moneyMeaning: row.money_meaning || '',
    studyMeaning: row.study_meaning || '',
    socialMeaning: row.social_meaning || '',
    authorNote: row.author_note || '',
    authorRealExpr: row.real_expr || '',
    authorMistakes: row.mistakes || '',
    myNote: note.my_note || '',
    realExpr: note.real_expr || '',
    mistakes: note.mistakes || '',
    tags: row.tags || [],
  };
}

export function noteToDb(note, userId, cardId) {
  return {
    user_id: userId,
    card_id: cardId,
    my_note: note.myNote || '',
    real_expr: note.realExpr || '',
    mistakes: note.mistakes || '',
    updated_at: new Date().toISOString(),
  };
}

export function rowToDraw(row) {
  return {
    id: row.id,
    date: row.date,
    question: row.question || '',
    cardId: row.card_id || '',
    orientation: row.orientation || '正位',
    interpretation: row.interpretation || '',
    event: row.event || '',
    tags: row.tags || [],
    needReview: row.need_review || false,
    reviewed: row.reviewed || false,
    actualEvent: row.actual_event || '',
    reviewNote: row.review_note || '',
    accuracy: row.accuracy || '待验证',
    score: row.score || 0,
  };
}

export function drawToDb(draw, userId) {
  const base = {
    user_id: userId,
    date: draw.date,
    question: draw.question || '',
    card_id: draw.cardId || null,
    orientation: draw.orientation || '正位',
    interpretation: draw.interpretation || '',
    event: draw.event || '',
    tags: draw.tags || [],
    need_review: draw.needReview || false,
    reviewed: draw.reviewed || false,
    actual_event: draw.actualEvent || '',
    review_note: draw.reviewNote || '',
    accuracy: draw.accuracy || '待验证',
    score: draw.score || 0,
    updated_at: new Date().toISOString(),
  };
  return base;
}

export function rowToCase(row) {
  return {
    id: row.id,
    clientCode: row.client_code || '',
    date: row.date,
    theme: row.theme || '',
    qType: row.q_type || '感情',
    spread: row.spread || '',
    cardIds: row.card_ids || [],
    interpretation: row.interpretation || '',
    feedback: row.feedback || '',
    accuracy: row.accuracy || '待验证',
    score: row.score || 0,
    tags: row.tags || [],
    reviewed: row.reviewed || false,
    reviewNote: row.review_note || '',
    spreadPhotoUrl: row.spread_photo_url || '',
  };
}

export function caseToDb(c, userId) {
  return {
    user_id: userId,
    client_code: c.clientCode || '',
    date: c.date,
    theme: c.theme || '',
    q_type: c.qType || '感情',
    spread: c.spread || '',
    card_ids: c.cardIds || [],
    interpretation: c.interpretation || '',
    feedback: c.feedback || '',
    accuracy: c.accuracy || '待验证',
    score: c.score || 0,
    tags: c.tags || [],
    reviewed: c.reviewed || false,
    review_note: c.reviewNote || '',
    spread_photo_url: c.spreadPhotoUrl || '',
    updated_at: new Date().toISOString(),
  };
}

export function seedCardToDb(card, sortOrder) {
  return {
    id: card.id,
    name: card.name,
    en_name: card.enName || '',
    number: card.number || '',
    suit: card.suit,
    image_url: card.image || `/cards/${card.id}.jpg`,
    upright_kw: card.uprightKw || '',
    reversed_kw: card.reversedKw || '',
    upright_meaning: card.uprightMeaning || '',
    reversed_meaning: card.reversedMeaning || '',
    love_meaning: card.loveMeaning || '',
    career_meaning: card.careerMeaning || '',
    money_meaning: card.moneyMeaning || '',
    study_meaning: card.studyMeaning || '',
    social_meaning: card.socialMeaning || '',
    author_note: card.myNote || '',
    real_expr: card.realExpr || '',
    mistakes: card.mistakes || '',
    tags: card.tags || [],
    sort_order: sortOrder,
  };
}
