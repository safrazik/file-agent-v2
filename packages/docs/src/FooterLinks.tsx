import React from 'react';
import { makeStyles, useTheme, Theme } from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import Grid from '@material-ui/core/Grid';
import NextLink from 'next/link';
import LinearProgress from '@material-ui/core/LinearProgress';

type Link = '/' | '/getting-started' | '/advanced-usage';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    marginTop: '30px',
    // maxWidth: 400,
    // flexGrow: 1,
  },
  container: {
    marginTop: '15px',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column-reverse',
    },
  },
}));

export interface FooterLinksProp {
  step?: number;
  prev?: { link: Link; label: string };
  next?: { link: Link; label: string };
}

export default function FooterLinks(props: FooterLinksProp) {
  const classes = useStyles();
  const activeStep = props.step || 0;
  const totalSteps = 2;
  const progress = (activeStep / totalSteps) * 100;
  return (
    <div className={classes.root}>
      <LinearProgress variant="determinate" value={progress} />
      <Grid container spacing={1} className={classes.container}>
        <Grid item xs={12} sm={6} md={6}>
          {props.prev ? (
            <NextLink href={props.prev.link} passHref>
              <Button color="primary" style={{ textTransform: 'none' }} component="a" size="small">
                <KeyboardArrowLeft />
                {props.prev.label}
              </Button>
            </NextLink>
          ) : (
            <div></div>
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={6} style={{ textAlign: 'right' }}>
          {props.next ? (
            <NextLink href={props.next.link} passHref>
              <Button color="primary" style={{ textTransform: 'none' }} component="a" size="small">
                {props.next.label}
                <KeyboardArrowRight />
              </Button>
            </NextLink>
          ) : (
            <div></div>
          )}
        </Grid>
      </Grid>
    </div>
  );
}
