import React, { useState } from 'react'
import { TwitterTweetEmbed } from 'react-twitter-embed';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Link from '@material-ui/core/Link';
import CircularProgress from '@material-ui/core/CircularProgress';

const Home = () => {

  const classes = makeStyles(theme => ({
    root: {
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      // width: '100',
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
      width: '100%',
    },
    iconButton: {
      padding: 10,
    },
    divider: {
      height: 28,
      margin: 4,
    },
  }))();
  
  const [ tweets, setTweets ] = useState([]);
  const [ username, setUsername ] = useState('');
  const [ loading, setLoading ] = useState(false);

  const getDert = (event) => {
    event.preventDefault();
    setLoading(true);
    fetch(`api/dert?user=${username}`).then(resp => resp.json()).then(tweetsResp => {
      console.log(tweetsResp);
      setTweets(tweetsResp);
      setLoading(false);
    });
  }

  console.log("in render");
  console.log(tweets);
  return (
    <div>
      <div>
        <AppBar position="static">
          <Grid container justify="center">
            <Grid item>
              <Toolbar>
                <Link href="/">
                  <img
                    alt=""
                    style={{ height: '45px', cursor: 'pointer' }}
                    src="/logo.png"
                  />
                </Link>
              </Toolbar>
            </Grid>
          </Grid>
        </AppBar>
        <Container maxWidth="sm">
          <Paper component="form" onSubmit={getDert} className={classes.root}>
            <InputBase
              className={classes.input}
              placeholder="Search for dert by username"
              value={username}
              onChange={value => {
                console.log(value.target.value);
                setUsername(value.target.value)}
              }
              disabled={loading}
            />
            <IconButton type="submit" className={classes.iconButton} disabled={loading}>
              <SearchIcon />
            </IconButton>
          </Paper>
        </Container>
        <Grid container justify="center">
          { loading && <CircularProgress />}
          {
            tweets.map(tweet => (
              <Grid item>
                <div>{tweet.id}</div>
                <TwitterTweetEmbed tweetId={tweet.id} />
              </Grid>
            ))
          }
        </Grid>
      </div>
  
      <style jsx>{`
        .hello {
          marginLeft: 4,
          flex: 1,
          width: 100% !important
        },
        .icon-button: {
          padding: 10,
          float: right
        }
      `}</style>
    </div>
  )
}

export default Home
