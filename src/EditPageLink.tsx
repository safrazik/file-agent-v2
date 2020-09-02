import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import branding from './branding';
// import branding from '.'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    marginTop: '30px',
    textAlign: 'right',
  },
}));

type DocPath = 'index.mdx' | 'getting-started.mdx' | 'advanced-usage.mdx';

export interface EditPageLinkProps {
  path: DocPath;
}

export default function EditPageLink(props: EditPageLinkProps) {
  const classes = useStyles();
  const url = branding.githubEditBaseUrl + '/' + props.path;
  return (
    <div className={classes.root}>
      <Link href={url} target="_blank" color="secondary">
        Edit this page
      </Link>
    </div>
  );
}
