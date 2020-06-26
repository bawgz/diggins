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
import Hidden from '@material-ui/core/Hidden';

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
    topSpacing: {
      marginTop: '40px',
    },
  }))();

  const [ tweets, setTweets ] = useState([]);
  const [ username, setUsername ] = useState('');
  const [ loading, setLoading ] = useState(false);

  const getDert = (event) => {
    event.preventDefault();
    setLoading(true);
    setTweets([]);
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
        <Container maxWidth="sm" className={classes.topSpacing}>
          <Paper component="form" onSubmit={getDert} className={classes.root}>
            <InputBase
              className={classes.input}
              placeholder="Search by username"
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
        <Grid container direction="column" alignItems="center" justify="center">
          { loading && (
              <Grid item className={classes.topSpacing}>
                <CircularProgress/>
              </Grid>
          )}
          { loading && (
            <Grid item>
              Yeah, this might take a while...
            </Grid>
          )}
          {
            tweets.map((tweetId, index) => (
              <Grid item key={index}>
                <div>{index}: {tweetId}</div>
                <TwitterTweetEmbed tweetId={tweetId} />
              </Grid>
            ))
          }
        </Grid>
      </div>
  
      {/* <style jsx>{`
        .top-spacing: {
          margin-top: 40px
        }
      `}</style> */}
    </div>
  )
}

export default Home
