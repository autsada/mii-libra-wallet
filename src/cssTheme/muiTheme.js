import { createMuiTheme } from '@material-ui/core/styles'

import { myTheme } from './myTheme'

export const muiTheme = createMuiTheme({
  overrides: {
    MuiIconButton: {
      root: {
        padding: '0'
      }
    },
    MuiInputLabel: {
      root: {
        fontSize: '12px',
        color: myTheme.teal
      }
    },
    MuiOutlinedInput: {
      root: {
        fontSize: '16px',
        color: myTheme.black
      }
    },
    MuiInput: {
      input: {
        background: 'white'
      }
    },
    MuiButton: {
      root: {
        color: myTheme.white,
        background: myTheme.libraBlue,
        fontSize: '1.3rem',
        border: `0.6px solid ${myTheme.white};`,
        cursor: 'pointer',
        margin: '0',

        '&:hover': {
          backgroundColor: `${myTheme.darkBlue}`
        }
      }
    },
    MuiToolbar: {
      root: {
        '@media (max-width: 600px)': {
          height: '5rem'
        }
      }
    }
  },
  ...myTheme,
  palette: { primary: { main: myTheme.teal } }
})
