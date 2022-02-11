//
// Copyright 2022 DXOS.org
//

import clsx from 'clsx';
import { css } from "@emotion/css";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { schema } from "prosemirror-schema-basic";
import { suggest, Suggester } from "prosemirror-suggest";
import React, { useEffect, useRef, useState } from "react";

const styles = css`
  > div {
    p {
      margin: 0;
    }
  }

  .ProseMirror {
    word-wrap: break-word;
    white-space: pre-wrap;
    white-space: break-spaces;
    font-family: sans-serif;
    line-height: 1.2;
    outline: none;
    padding-right: 0;
    position: relative;
    max-width: 100%;
    min-height: 100%;
  }

`;

const suggestStyles = css`
.command-suggest {
  .active {
    color: red;
  }
}
`

const initialCommandsList = [
  "select",
  "children",
  "links",
  "parent",
  "source",
  "target",
  "filter",
];

// NOTE: Documentation is out of date.
// TODO(burdon): https://github.com/remirror/remirror/tree/HEAD/packages/prosemirror-suggest
//  - https://github.com/remirror/remirror/blob/main/packages/prosemirror-suggest/src/suggest-types.ts
// TODO(burdon): See hooks.
//  - https://github.com/remirror/remirror/blob/main/packages/remirror__react-hooks/src/use-suggest.ts

// TODO(burdon): CSS?
// const suggestCommands: Suggester = {
//   char: ".",
//   name: "commands",
//   validPrefixCharacters: /^.$/,
//   onChange: ({ query, ...rest }) => {
//     console.log("onChange", query, rest);
//   },
// };


const SuggestionItem = ({item, isActive}: {item: any, isActive: boolean}) => {
  const ref = useRef<any>(null);
  useEffect(() => {
    if (isActive) {
      ref.current.focus();
    }
  }, [ref, isActive]);
  return (
    <button ref={ref}>{item}</button>
  );
};

export interface EditorProps {}

// https://prosemirror.net/examples/basic
export const Editor = ({}: EditorProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [showSuggestions, setShowSuggestion] = useState(false);
  const [commandsList, setCommandLists] = useState(initialCommandsList);
  const [commandMatch, setCommandMatch] = useState('');
  useEffect(() => {
    let selectedIndex = 0;

    const suggestCommands: Suggester = {
      // By default decorations are used to highlight the currently matched
      // suggestion in the dom.
      // In this example we don't need decorations (in fact they cause problems when the
      // emoji string replaces the query text in the dom).
      // noDecorations: true,
      char: ".", // The character to match against
      name: "command-suggestion", // a unique name
      // appendText: "", // Text to append to the created match

      // Keybindings are similar to prosemirror keymaps with a few extra niceties.
      // The key identifier can also include modifiers (e.g.) `Cmd-Space: () => false`
      // Return true to prevent any further keyboard handlers from running.
      // keyBindings: {
      //   ArrowUp: () => {
      //     // selectedIndex = rotateSelectionBackwards(
      //     //   selectedIndex,
      //     //   emojiList.length
      //     // );
      //   },
      //   ArrowDown: () => {
      //     // selectedIndex = rotateSelectionForwards(
      //     //   selectedIndex,
      //     //   emojiList.length
      //     // );
      //   },
      //   Enter: ({ command }) => {
      //     if (showSuggestions) {
      //       command(emojiList[selectedIndex]);
      //     }
      //   },
      //   Esc: () => {
      //     showSuggestions = false;
      //   },
      // },

      onChange: (params) => {
        const query = params.query.full;
        console.log('query', query);
        const command = commandsList.find((command) => command.includes(query));
        console.log('command', command);
        if (command) {
          setCommandMatch(command);
        } else {
          setCommandMatch('');
        }
        
        // emojiList = sortEmojiMatches({ query, maxResults });
        // selectedIndex = 0;
        setShowSuggestion(true);
      },
    };

    // Create the plugin with the above configuration. It also supports multiple plugins being added.
    const suggestionPlugin = suggest(suggestCommands);

    // Create editor.
    const view = new EditorView(ref.current!, {
      state: EditorState.create({
        plugins: [suggestionPlugin],
        schema,
      }),
    });

    view.focus();
  }, [ref]);

  return (
    <div className={suggestStyles}>
      <div
        ref={ref}
        spellCheck={false}
        style={{
          padding: 16,
          margin: 16,
          height: 80,
          border: "1px solid #999",
        }}
        className={styles}
      />
      {commandsList.length && (
        <ul className='command-suggest'>
          {commandsList.map((item) => {
            const activeItem = item === commandMatch;
            return (
              <li className={clsx(activeItem && 'active')}>
                <SuggestionItem item={item} isActive={activeItem} />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
