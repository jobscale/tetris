#### run with container

```bash
git clone git@github.com:jobscale/tetris.git
cd tetris
main() {
  docker build . -t local/tetris
  docker run --rm --name tetris --rm -p 3000:80 -d local/tetris
  xdg-open http://127.0.0.1:3000
  xdg-open http://127.0.0.1:3000/tetris/
} && main
```
