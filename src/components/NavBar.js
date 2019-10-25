import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { AppBar, Toolbar } from '@material-ui/core'
import styled from 'styled-components'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  }
}))

const NavBarStyle = styled(AppBar)`
  display: block;
  text-align: center;
  background: ${props => props.theme.libraBlue};
  height: 20%;

  .nav-bar {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;

    .logo {
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;

      h2 {
        margin: 0;
        padding: 0;
      }

      img {
        @media ${props => props.theme.lg} {
          width: 110px;
        }

        @media ${props => props.theme.md} {
          width: 100px;
        }

        @media ${props => props.theme.sm} {
          width: 70px;
        }
      }

      .testnet {
        background: red;
        color: white;
        padding: 0.3rem 0.8rem;
        border-radius: 4px;
        font-size: 1.3rem;
      }
    }
  }

  @media ${props => props.theme.sm} {
    height: 5rem;

    .MuiToolbar-regular {
      min-height: 0;
    }

    button {
      margin: 0 0.3rem;
      font-size: 1rem;
    }

    .menu-icon {
      display: block;
    }
  }
`

const NavBar = () => {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <NavBarStyle position='static'>
        <Toolbar className='nav-bar'>
          <div className='logo'>
            <img src='/assets/libra.png' width='115' alt='LIBRA WALLET' />
            <div className='testnet'>TestNet</div>
          </div>
        </Toolbar>
      </NavBarStyle>
    </div>
  )
}

export default NavBar
