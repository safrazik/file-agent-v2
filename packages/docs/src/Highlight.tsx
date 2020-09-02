import React from 'react';

type Mode = 'javascript' | 'css' | 'html';

type Language = Mode | 'code:tabs';

export interface HighlightProps {
  language?: Language;
  className?: string;
  children: string;
}

export class Highlight extends React.Component<
  HighlightProps,
  {
    code: string;
  }
> {
  private language: Language;
  constructor(props: HighlightProps) {
    super(props);
    this.language = props.language || ((props.className || 'unknown').replace('language-', '') as Language);
    const code = props.children;
    this.state = {
      code,
    };
  }
  componentDidUpdate(prevProps: HighlightProps) {
    if (prevProps.children !== this.props.children) {
      this.setState({
        code: this.props.children,
      });
    }
  }
  render() {
    return <div className={'highlight-container'}>{this.state.code}</div>;
  }
}
