## Run the app
1. download the entire project.

2. add your tw developer credential in:
\tweet-streaming\tweet-feeder\.env
```
  TWITTER_API_KEY = <your api-key>
  TWITTER_API_SECRET = <your api secret>
  TWITTER_ACCESS_TOKEN = <your access token>
  TWITTER_ACCESS_TOKEN_SECRET = <your access token secret>
  TWITTER_BEARER_TOKEN = <bear token, not needed >
```

3. In a docker environment such as window wsl run following command
```
  docker-compose up
```
  This should spin up three containers (redis, tween-feeder, and tweet-analyzer) along with output in the console window.

4. Monitor the realtime tweet statistics information from browser
  url: localhost:3000.
  The tweet statistic information is updated every second.

## Design

1. This application will spin up three containers:

    - tweet-feeder: dedicated process to pull tweets from Twitter  
    - tweet-analyzer: dedicated process to analyze the tweet content.
    - redis: served as messaging system between tweet-feeder and tweet-analyzer.  

    Also there is web client which will display realtime tweet stats in browser via socket.io.

2. Scalability Consideration  

Due to the high volume of tweets, this design has the scalability in consideration. The dedicated tweet-feeder does one thing to pull data from twitter without any further processing. The received data is pipelined to tweet-analyzer via redis pub/sub system. The data processing is done in tweet-analyzer in a separated process.

In the initial implementation, there is one pair of tweet-feeder and tweet-analyzer, which seems handling the data load well. Due to the microservice architecture used in this project, it should be easily scale it up by configuring multiple notification channels in one redis along with multiple tweet-analyzer(s), or even multiple redis servers with more tweet-analyzer(s), if we need to handle higher data rate or in depth data processing.

Currently tweet-analyzer also serves as a limited restful api server and web server. In future, those two components can be further factored out as separated microservices.
