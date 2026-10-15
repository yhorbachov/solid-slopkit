// Spotlight's actions: flattening, the default filter, grouping, and the keyboard shortcut.
import type { JSX } from '@solidjs/web';

/** Content of an action's section, or a function that makes it when the action is shown. */
export type SpotlightSection = JSX.Element | (() => JSX.Element);

/** Something the spotlight can do. */
export interface SpotlightAction {
  /** Names it among the actions. Unique. */
  id: string;
  /** What it's called: shown, searched, and highlighted with `highlightQuery`. */
  label: string;
  /** A line under the label, searched too. */
  description?: string;
  /** More words it's found by, not shown, such as synonyms. */
  keywords?: readonly string[];
  /** The heading it's shown under. Set by a group in `actions`. */
  group?: string;
  /**
   * Content before the label, usually an icon. A function is called when the action is shown: pass one for JSX made
   * outside a component's JSX, such as in its body (`leftSection: () => <HomeIcon />`), which the server would make
   * without rendering, so hydration couldn't find it.
   */
  leftSection?: SpotlightSection;
  /** Content after the label, such as a shortcut or a badge. A function is called when the action is shown. */
  rightSection?: SpotlightSection;
  /** Shown, but can't be triggered, and skipped by the keyboard. */
  disabled?: boolean;
  /** Called when it's triggered: a click, or Enter while it's active. */
  onTrigger?: () => void;
}

/** Actions under a heading. */
export interface SpotlightActionGroup {
  group: string;
  actions: readonly SpotlightAction[];
}

/** Actions and groups of them, in the order they're shown. */
export type SpotlightActions = readonly (SpotlightAction | SpotlightActionGroup)[];

/** Picks the actions to show for a query, in order. The actions carry their `group`. */
export type SpotlightFilter = (query: string, actions: readonly SpotlightAction[]) => readonly SpotlightAction[];

/** The actions in one list, each group's carrying its name. */
export function flattenActions(actions: SpotlightActions): SpotlightAction[] {
  return actions.flatMap((entry) =>
    'actions' in entry ? entry.actions.map((action) => ({ ...action, group: entry.group })) : [entry],
  );
}

/**
 * The default filter: the actions whose label, description or keywords contain every word of the query, ignoring
 * case. An empty query keeps them all.
 */
export const filterActions: SpotlightFilter = (query, actions) => {
  const words = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return actions;
  return actions.filter((action) => {
    const text = [action.label, action.description ?? '', ...(action.keywords ?? [])].join(' ').toLocaleLowerCase();
    return words.every((word) => text.includes(word));
  });
};

export interface ActionGroup {
  /** The heading; none for the actions without a group. */
  name?: string;
  actions: SpotlightAction[];
}

/** The actions gathered by group, in the order each group first appears. */
export function groupActions(actions: readonly SpotlightAction[]): ActionGroup[] {
  const groups = new Map<string | undefined, ActionGroup>();
  for (const action of actions) {
    let group = groups.get(action.group);
    if (!group) groups.set(action.group, (group = { name: action.group, actions: [] }));
    group.actions.push(action);
  }
  return [...groups.values()];
}
