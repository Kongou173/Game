const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const player = {
    width: 50,
    height: 50,
    x: 50,
    y: canvas.height / 2 - 25,
    speed: 5,
    color: 'blue'
};

const bullets = [];
const enemies = [];
const enemyInterval = 1000;
let lastEnemySpawnTime = 0;
const bulletSpeed = 7;

function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // プレイヤーを描画
    drawRect(player.x, player.y, player.width, player.height, player.color);

    // 弾を更新および描画
    bullets.forEach((bullet, index) => {
        bullet.x += bulletSpeed;
        if (bullet.x > canvas.width) {
            bullets.splice(index, 1);
        } else {
            drawRect(bullet.x, bullet.y, bullet.width, bullet.height, bullet.color);
        }
    });

    // 敵を更新および描画
    const currentTime = Date.now();
    if (currentTime - lastEnemySpawnTime > enemyInterval) {
        enemies.push({
            x: canvas.width,
            y: Math.random() * (canvas.height - 50),
            width: 50,
            height: 50,
            color: 'red'
        });
        lastEnemySpawnTime = currentTime;
    }

    enemies.forEach((enemy, index) => {
        enemy.x -= 3;
        if (enemy.x + enemy.width < 0) {
            enemies.splice(index, 1);
        } else {
            drawRect(enemy.x, enemy.y, enemy.width, enemy.height, enemy.color);
        }
    });

    // 弾と敵の衝突判定
    bullets.forEach((bullet, bulletIndex) => {
        enemies.forEach((enemy, enemyIndex) => {
            if (bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y) {
                bullets.splice(bulletIndex, 1);
                enemies.splice(enemyIndex, 1);
            }
        });
    });

    requestAnimationFrame(update);
}

function handleKeyDown(e) {
    switch (e.key) {
        case 'ArrowUp':
            player.y -= player.speed;
            break;
        case 'ArrowDown':
            player.y += player.speed;
            break;
        case ' ':
            bullets.push({
                x: player.x + player.width,
                y: player.y + player.height / 2 - 5,
                width: 10,
                height: 10,
                color: 'yellow'
            });
            break;
    }
}

document.addEventListener('keydown', handleKeyDown);
update();

