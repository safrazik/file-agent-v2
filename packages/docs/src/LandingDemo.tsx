import React, { useState } from 'react';

import { FileRecord, plugins, Theme, Layout } from '@file-agent/core';
import * as tus from 'tus-js-client';

// import FileIcon from '../components/file-icon';
// import FilePreview from '../components/file-preview';
import { FileAgent } from '@file-agent/react';
//
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ListIcon from '@material-ui/icons/Reorder';
import GridIcon from '@material-ui/icons/Apps';

import { createStyles, makeStyles, ThemeProvider, createMuiTheme, Theme as MuiTheme } from '@material-ui/core/styles';

const baseUrl = 'https://safrazik.com/vue-file-agent/website/assets/';

// plugins.tus = (window as any).tus;
plugins.tus = tus;

const rawFileRecords = [
  {
    name: 'Some Large File.zip',
    size: 25165824, // 24 MB
    type: 'application/zip',
    ext: 'zip',
  },
  {
    name: 'House Sparrow.jpg',
    lastModified: 1583992794341,
    sizeText: '14 KB',
    size: 14403,
    type: 'image/jpeg',
    ext: 'jpg',
    url: baseUrl + 'files/House Sparrow.jpg',
    progress: 67,
  },
  {
    name: 'Golf.mp4',
    lastModified: 1576563996233,
    sizeText: '549 KB',
    size: 561813,
    type: 'video/mp4',
    ext: 'mp4',
    dimensions: {
      width: 640,
      height: 360,
    },
    url: baseUrl + 'files/Golf.mp4',
    videoThumbnail: baseUrl + 'files/Golf-thumb.jpg',
    imageColor: [66, 62, 45],
  },
  {
    name: 'sample.pdf',
    lastModified: 1565232623243,
    sizeText: '3 KB',
    size: 3028,
    type: 'application/pdf',
    ext: 'pdf',
    url: baseUrl + 'files/sample.pdf',
  },
];

const maxSize = '4MB';

const useStyles = makeStyles((theme: MuiTheme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    button: {
      // margin: theme.spacing(1),
      margin: 5,
    },
  }),
);

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

export default function LandingDemo() {
  const classes = useStyles();
  const [fileRecords, setFileRecords] = useState([] as FileRecord[]);
  const [theme, setTheme] = useState<Theme>('rounded');
  const [layout, setLayout] = useState<Layout>('grid');

  const layoutOptions = { grid: 'Grid', list: 'List' } as Record<Layout, string>;
  const themeOptions = {
    'default': 'Default',
    'rounded': 'Rounded',
    'circle': 'Circle',
    'light': 'Light',
    'dark': 'Dark',
    'light-circle': 'Light Circle',
    'dark-circle': 'Dark Circle',
  } as Record<Theme, string>;

  if (!fileRecords.length) {
    FileRecord.fromRawArray(rawFileRecords as any, { read: false, maxSize }).then((fRecords) => {
      setFileRecords(fRecords);
      setTimeout(() => {
        setTimeout(() => {
          fRecords[0].progress(34);
          fRecords[0].setError('Custom Error test');
          fRecords[0].nameWithoutExtension('Hello Sample');
        }, 2000);
        setFileRecords(fRecords.reverse().concat([]));
      }, 2000);
    });
  }

  return (
    <div className={`landing-demo layout-${layout}`}>
      <div style={{ marginBottom: 15 }}>
        <Button
          size="small"
          variant="contained"
          color={layout === 'grid' ? 'primary' : 'default'}
          className={classes.button}
          startIcon={<GridIcon />}
          onClick={() => {
            setLayout('grid');
          }}
        >
          Grid
        </Button>
        <Button
          size="small"
          variant="contained"
          color={layout === 'list' ? 'primary' : 'default'}
          className={classes.button}
          startIcon={<ListIcon />}
          onClick={() => {
            setLayout('list');
          }}
        >
          List
        </Button>
      </div>
      <FileAgent
        {...{
          auto: false,
          uploadUrl: 'https://master.tus.io/files/',
          resumable: true,
          multiple: true,
          fileRecords,
          deletable: true,
          editable: true,
          linkable: true,
          maxSize,
          layout,
          theme,
          sortable: true,
          draggable: document.body,
          // sortable: true,
          // theme: 'list',
          // draggable: document.getElementById('file-drag-area'),
          // events: {
          onBeforeDelete: (fileRecord) => {
            console.log('onBeforrrrrr', fileRecord.name());
            if (true || confirm('Sure?')) {
              return true;
            }
            return false;
          },
          onBeforeRename: (fileRecord) => {
            console.log('onBefoererere', ',,,,');
            // return false;
          },
          onSelect: (fRecords) => {
            console.log('onSelect', fRecords);
          },
          onRename: (fileRecord) => {
            console.log('onRename', fileRecord.name(), fileRecord);
            if (fileRecord.name().toLowerCase().indexOf('shit') === -1) {
              return;
            }
            fileRecord.setError('Shitty name is not allowed.');
            return new Promise((resolve, reject) => {
              setTimeout(() => {
                resolve(false);
              }, 3000);
            });
          },
          onDelete: (fileRecord) => {
            console.log('onDelete', fileRecord.name(), fileRecord);
            if (fileRecord.name().toLowerCase().indexOf('system') === -1) {
              return;
            }
            return new Promise((resolve, reject) => {
              setTimeout(() => {
                fileRecord.setError('System files cannot be deleted.');
                resolve(false);
              }, 1000);
            });
          },
          // },
          slotsOld: {
            afterInner: 'After inner',
            afterOuter: 'After outer',
            beforeInner: document.getElementById('some-unique-el'),
            beforeOuter: 'Before outer',
            // filePreview: (fileRecord) => {
            //   return `<div>
            //       File: ${fileRecord.name()}
            //     </div>`;
            // },
            //     filePreviewNewx: `<div class="file-preview-wrapper grid-box-item grid-block file-preview-new">

            // <span class="file-preview">
            //   <span style="position: absolute; top: 0; right: 0; bottom: 0; left: 0;">
            //     <h1 data-ref="help-text" class="help-text"></h1>
            //   </span>
            // </span>
            //         </div>`,
            sortableHandle: 'Sortable Handle',
          },
        }}
      />
      <ThemeProvider theme={darkTheme}>
        <Box style={{ display: 'none' }} component="span" m={1}>
          <div>
            <FormControl className={classes.formControl}>
              <InputLabel id="demo-simple-select-label">Layout</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={layout}
                onChange={(event) => {
                  setLayout(event.target.value as Layout);
                }}
              >
                {Object.keys(layoutOptions).map((key) => (
                  <MenuItem key={key} value={key}>
                    {layoutOptions[key as Layout]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl className={classes.formControl}>
              <InputLabel id="demo-simple-select-helper-label">Theme</InputLabel>
              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={theme}
                onChange={(event) => {
                  setTheme(event.target.value as Theme);
                }}
              >
                {Object.keys(themeOptions).map((key) => (
                  <MenuItem key={key} value={key}>
                    {themeOptions[key as Theme]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </Box>
      </ThemeProvider>
    </div>
  );
}
