export const SPREAD_TEMPLATES = [
  { id: 'single', name: '单牌', layout: 'row', slots: ['核心'] },
  { id: 'three-ppp', name: '三张牌阵', layout: 'row', slots: ['过去', '现在', '未来'] },
  { id: 'two-choice', name: '二选一', layout: 'row', slots: ['选项 A', '选项 B'] },
  { id: 'cross-5', name: '五牌十字', layout: 'cross', slots: ['现状', '挑战', '过去', '未来', '结果'] },
  { id: 'custom', name: '自定义', layout: 'row', slots: [] },
];

export function skeletonFromTemplate(templateId, slotCount = 3) {
  const tpl = SPREAD_TEMPLATES.find(t => t.id === templateId);
  if (!tpl) return [];
  if (templateId === 'custom') {
    const n = Math.min(10, Math.max(2, slotCount));
    return Array.from({ length: n }, (_, i) => ({
      slot: `位置 ${i + 1}`,
      cardId: '',
      orientation: '正位',
    }));
  }
  return tpl.slots.map(slot => ({ slot, cardId: '', orientation: '正位' }));
}

export function detectTemplateId(spreadCards) {
  if (!spreadCards?.length) return 'three-ppp';
  for (const tpl of SPREAD_TEMPLATES) {
    if (tpl.id === 'custom') continue;
    if (tpl.slots.length === spreadCards.length) {
      const namesMatch = tpl.slots.every((s, i) => spreadCards[i]?.slot === s);
      if (namesMatch) return tpl.id;
    }
  }
  return 'custom';
}

export function mergeSpreadCards(existing, skeleton) {
  return skeleton.map((s, i) => ({
    slot: s.slot,
    cardId: existing[i]?.cardId || '',
    orientation: existing[i]?.orientation || '正位',
  }));
}
