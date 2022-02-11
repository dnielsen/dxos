import React, { FC, useCallback, useMemo, useState } from 'react';
import { IdentifierSchemaAttributes } from 'remirror';
import {
  MentionAtomExtension,
  MentionAtomNodeAttributes,
  PlaceholderExtension,
  wysiwygPreset,
} from 'remirror/extensions';
import {
  EditorComponent,
  MentionAtomPopupComponent,
  MentionAtomState,
  Remirror,
  useRemirror
} from '@remirror/react';

const extraAttributes: IdentifierSchemaAttributes[] = [
  { identifiers: ['mention', 'emoji'], attributes: { role: { default: 'presentation' } } },
  { identifiers: ['mention'], attributes: { href: { default: null } } },
];

export interface MentionEditorProps extends Pick<MentionComponentProps, 'users' | 'tags'> {
  placeholder?: string;
}

interface MentionComponentProps<
  UserData extends MentionAtomNodeAttributes = MentionAtomNodeAttributes,
> {
  users?: UserData[];
  tags?: string[];
}

function MentionComponent({ users, tags }: MentionComponentProps) {
  const [mentionState, setMentionState] = useState<MentionAtomState | null>();
  const tagItems = useMemo(
    () => (tags ?? []).map((tag) => ({ id: tag, label: `#${tag}` })),
    [tags],
  );
  const items = useMemo(() => {
    if (!mentionState) {
      return [];
    }

    const allItems = mentionState.name === 'at' ? users : tagItems;

    if (!allItems) {
      return [];
    }

    const query = mentionState.query.full.toLowerCase() ?? '';
    return allItems.filter((item) => item.label.toLowerCase().includes(query)).sort();
  }, [mentionState, users, tagItems]);

  return <MentionAtomPopupComponent onChange={setMentionState} items={items} />;
}

export const MentionEditor: FC<MentionEditorProps> = ({ placeholder, ...props }) => {
  const extensions = useCallback(
    () => [
      new PlaceholderExtension({ placeholder }),
      new MentionAtomExtension({
        matchers: [
          { name: 'at', char: '@', appendText: ' ' },
          { name: 'tag', char: '#', appendText: ' ' },
        ],
      }),
      ...wysiwygPreset(),
    ],
    [placeholder],
  );

  const { children } = props;
  const { manager } = useRemirror({ extensions, extraAttributes });

  return (
    <Remirror manager={manager}>
      <EditorComponent />
      <MentionComponent {...props} />
      {children}
    </Remirror>
  );
};
