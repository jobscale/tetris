#### run with container

```bash
git clone https://github.com/jobscale/tetris.git
cd tetris
main() {
  docker build . -t local/tetris:0.0.1
  docker run --rm --name tetris --rm -p 3000:3000 -d local/tetris:0.0.1
  xdg-open https://127.0.0.1:3000
  xdg-open https://127.0.0.1:3000/tetris
} && main
```
