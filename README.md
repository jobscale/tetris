#### run with container

```bash
git clone https://github.com/jobscale/tetris.git
cd tetris
main() {
  docker build . -t local/tetris:0.0.1
  docker run --rm --name tetris --rm -p 443:443 -d local/tetris:0.0.1
  curl -k https://127.0.0.1
} && main
```
