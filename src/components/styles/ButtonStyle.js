import styled from 'styled-components'
import { Button } from '@material-ui/core'

const ButtonStyle = styled(Button)`
  color: ${props => props.theme.white};
  background: ${props => props.theme.teal};
  font-size: 1.6rem;
  border: 0.8px solid ${props => props.theme.white};

  &:hover {
    background: ${props => props.theme.darkTeal};
  }
`

export default ButtonStyle
