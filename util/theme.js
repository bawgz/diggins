import { createMuiTheme } from '@material-ui/core/styles';
import { brown, grey } from '@material-ui/core/colors';

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    primary: brown,
    secondary: grey
  }
});

export default theme;