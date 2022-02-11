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
  useRemirror,
  ThemeProvider
} from '@remirror/react';
import { AllStyledComponent } from '@remirror/styles/emotion';

const extraAttributes: IdentifierSchemaAttributes[] = [
  { identifiers: ['mention'], attributes: { role: { default: 'presentation' } } },
  { identifiers: ['mention'], attributes: { href: { default: null } } },
];

export interface MentionEditorProps extends Pick<MentionComponentProps, 'commands' | 'tags'> {
  placeholder?: string;
}

interface MentionComponentProps<
  UserData extends MentionAtomNodeAttributes = MentionAtomNodeAttributes,
> {
  commands?: UserData[];
  tags?: string[];
}

function MentionComponent({ commands, tags }: MentionComponentProps) {
  const [mentionState, setMentionState] = useState<MentionAtomState | null>();
  const tagItems = useMemo(
    () => (tags ?? []).map((tag) => ({ id: tag, label: `#${tag}` })),
    [tags],
  );
  const items = useMemo(() => {
    if (!mentionState) {
      return [];
    }

    const allItems = mentionState.name === 'dot' ? commands : tagItems;

    if (!allItems) {
      return [];
    }

    const query = mentionState.query.full.toLowerCase() ?? '';
    return allItems.filter((item) => item.label.toLowerCase().includes(query)).sort();
  }, [mentionState, commands, tagItems]);

  return <MentionAtomPopupComponent onChange={setMentionState} items={items} />;
}

export const MentionEditor: FC<MentionEditorProps> = ({ placeholder, ...props }) => {
  const extensions = useCallback(
    () => [
      new PlaceholderExtension({ placeholder }),
      new MentionAtomExtension({
        matchers: [
          { name: 'dot', char: '.', appendText: ' ' },
          { name: 'tag', char: '#', appendText: ' ' },
        ],
      }),
      ...wysiwygPreset(),
    ],
    [placeholder],
  );

  const { manager } = useRemirror({ extensions, extraAttributes });

  return (
    <AllStyledComponent>
      <ThemeProvider>
        <Remirror manager={manager}>
          <EditorComponent />
          <MentionComponent {...props} />
        </Remirror>
      </ThemeProvider>
    </AllStyledComponent>
  );
};
