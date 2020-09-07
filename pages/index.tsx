import { NextPage } from 'next';
import FooterLinks from '../src/FooterLinks';

import React from 'react';
import Layout from '../src/Layout';
import { fade, makeStyles, Theme, createStyles } from '@material-ui/core/styles';

import { LandingDemo, AdvancedDemo } from '../src/dynamic';

import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';

import Link from '@material-ui/core/Link';
import NextLink from 'next/link';

import Button from '@material-ui/core/Button';

import GitHubIcon from '@material-ui/icons/GitHub';

import IndexDocs from '../docs-content/index.mdx';
import branding from '../src/branding';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

const useStyles = makeStyles((theme) => ({
  offset: theme.mixins.toolbar,
}));

const Home: NextPage<{ userAgent: string }> = ({ userAgent }) => {
  const classes = useStyles();
  return (
    <Layout page="home">
      <div>
        <div className="intro-area">
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '30px', lineHeight: '30px' }}>
              <img
                src={branding.path('/assets/icon.png')}
                style={{
                  height: '46px',
                  marginBottom: '-8px',
                  marginRight: '10px',
                }}
              />
              FileAgent
            </h1>
            <h3
              style={{
                marginTop: '-5px',
                marginBottom: '45px',
              }}
            >
              The most <span style={{ color: '#ff5823' }}>beautiful</span> and{' '}
              <span style={{ color: '#2cecff' }}>full-featured</span> frontend file handler for
              <br />
              <span style={{ fontSize: '120%' }}>
                <span style={{ color: 'lightblue' }}>React</span>, <span style={{ color: 'lightgreen' }}>Vue</span> and{' '}
                <span style={{ color: 'yellow' }}>JavaScript</span>
              </span>
            </h3>
          </div>
          <LandingDemo />
          <div style={{ maxWidth: '620px', margin: 'auto', textAlign: 'center', marginTop: '30px' }}>
            <NextLink href="/getting-started" passHref>
              <Button
                variant="contained"
                color="primary"
                size="medium"
                style={{ marginBottom: '8px', marginRight: '8px' }}
              >
                Get Started
              </Button>
            </NextLink>
            <Button
              variant="contained"
              color="default"
              size="medium"
              href={branding.githubUrl}
              style={{
                marginBottom: '8px',
              }}
              startIcon={<GitHubIcon />}
            >
              GitHub
            </Button>
          </div>
        </div>
        <div className="content-area">
          <Card className="content-card">
            <CardContent>
              <h3>Advanced Demo</h3>
              <AdvancedDemo />
            </CardContent>
          </Card>
        </div>
      </div>
      <IndexDocs />
      <FooterLinks step={0} next={{ link: '/getting-started', label: 'Getting Started' }} />
    </Layout>
  );
};

export default Home;
