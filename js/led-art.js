// Original Pets artwork. One cell equals one round diode.
export const LED_COLORS = {
    p: '#ff7a24', P: '#b84b16', h: '#ffc394',
    r: '#ff9c55', R: '#cc5b24', y: '#ffda73', o: '#ffa951',
    g: '#b1ec52', G: '#58964c', m: '#7ce0af',
    w: '#fff3df', W: '#dcb89a', k: '#d9a066', K: '#8d5c3e',
    c: '#00ffff', C: '#238e9d', v: '#413429',
};

function sprite(paint) {
    const grid = Array.from({ length: 32 }, () => Array(32).fill('.'));
    const dot = (x, y, color) => {
        if (x >= 0 && x < 32 && y >= 0 && y < 32) grid[y][x] = color;
    };
    const ellipse = (cx, cy, rx, ry, color) => {
        for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++)
            for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++)
                if (((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1) dot(x, y, color);
    };
    const line = (x1, y1, x2, y2, color, width = 1) => {
        const steps = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1));
        for (let i = 0; i <= steps; i++) {
            const x = Math.round(x1 + (x2 - x1) * i / (steps || 1));
            const y = Math.round(y1 + (y2 - y1) * i / (steps || 1));
            for (let oy = 0; oy < width; oy++)
                for (let ox = 0; ox < width; ox++) dot(x + ox, y + oy, color);
        }
    };
    const polygon = (points, color) => {
        for (let y = 0; y < 32; y++) {
            for (let x = 0; x < 32; x++) {
                let inside = false;
                for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
                    const [ax, ay] = points[i], [bx, by] = points[j];
                    if ((ay > y) !== (by > y) && x < (bx - ax) * (y - ay) / (by - ay) + ax) inside = !inside;
                }
                if (inside) dot(x, y, color);
            }
        }
    };
    const ring = (cx, cy, radius, color) => {
        for (let y = cy - radius; y <= cy + radius; y++)
            for (let x = cx - radius; x <= cx + radius; x++) {
                const d = Math.hypot(x - cx, y - cy);
                if (d >= radius - .8 && d <= radius + .3) dot(x, y, color);
            }
    };
    paint({ dot, ellipse, line, polygon, ring });
    return grid.map(row => row.join(''));
}

const dog = sprite(({ dot, ellipse, line, polygon }) => {
    // Floppy ears, a light muzzle, happy eyes, and a cyan collar.
    polygon([[7, 6], [3, 7], [1, 15], [3, 24], [7, 25], [10, 10]], 'K');
    polygon([[24, 6], [28, 7], [31, 15], [28, 24], [24, 25], [21, 10]], 'K');
    line(4, 10, 3, 18, 'k'); line(28, 10, 29, 17, 'k');
    ellipse(15.5, 15, 10.5, 11, 'k');
    ellipse(15.5, 11, 9.5, 7, 'p');
    polygon([[14, 5], [17, 5], [19, 14], [17, 19], [14, 19], [12, 14]], 'w');
    ellipse(10, 14, 1.4, 1.8, 'v'); ellipse(21, 14, 1.4, 1.8, 'v');
    dot(10, 13, 'w'); dot(21, 13, 'w');
    ellipse(15.5, 20, 6, 4, 'w');
    ellipse(15.5, 18.5, 2.5, 1.5, 'v');
    line(16, 20, 16, 22, 'v'); line(13, 22, 19, 22, 'v');
    ellipse(16, 23, 1.2, 1.5, 'r');
    line(8, 27, 23, 27, 'C', 2); line(9, 27, 22, 27, 'c');
    ellipse(16, 29, 2, 2, 'y'); dot(16, 29, 'k');
});

const cat = sprite(({ dot, ellipse, line, polygon }) => {
    // A cream-and-ginger cat with pointed ears and whiskers.
    polygon([[4, 2], [14, 9], [4, 18]], 'p');
    polygon([[27, 2], [18, 9], [28, 18]], 'k');
    polygon([[6, 6], [11, 10], [6, 13]], 'K');
    polygon([[25, 6], [21, 10], [26, 13]], 'K');
    ellipse(15.5, 17, 12, 10, 'w');
    polygon([[6, 10], [12, 7], [15, 10], [13, 16], [6, 20], [4, 15]], 'p');
    polygon([[25, 10], [20, 8], [18, 11], [21, 16], [27, 18]], 'k');
    line(14, 8, 15, 11, 'K'); line(18, 8, 17, 11, 'K');
    ellipse(10, 17, 2.3, 1.8, 'C'); ellipse(21, 17, 2.3, 1.8, 'C');
    line(10, 16, 10, 18, 'v'); line(21, 16, 21, 18, 'v');
    dot(9, 16, 'c'); dot(20, 16, 'c');
    polygon([[14, 21], [18, 21], [16, 23]], 'K');
    line(16, 23, 16, 24, 'K'); dot(14, 25, 'K'); dot(18, 25, 'K');
    line(1, 20, 7, 22, 'W'); line(1, 24, 7, 24, 'W');
    line(24, 22, 30, 20, 'W'); line(24, 24, 30, 24, 'W');
    line(10, 28, 22, 28, 'c'); dot(16, 29, 'y');
});

const bowl = sprite(({ dot, ellipse, line, polygon }) => {
    // A paw above a full bowl: a recurring food order.
    ellipse(5, 10, 2.5, 3.5, 'p'); ellipse(12, 6, 2.5, 3.5, 'p');
    ellipse(20, 6, 2.5, 3.5, 'p'); ellipse(27, 10, 2.5, 3.5, 'p');
    ellipse(16, 17, 7, 6, 'p'); ellipse(11, 19, 4, 3, 'p'); ellipse(21, 19, 4, 3, 'p');
    dot(4, 8, 'h'); dot(11, 4, 'h'); dot(19, 4, 'h'); dot(26, 8, 'h');
    ellipse(16, 23.5, 11, 2, 'w');
    [[8, 23], [11, 22], [14, 23], [17, 22], [20, 23], [23, 22]].forEach(([x,y]) => dot(x, y, 'k'));
    polygon([[5, 24], [27, 24], [25, 30], [7, 30]], 'C');
    line(6, 25, 25, 25, 'c'); line(4, 30, 28, 30, 'c');
    ellipse(16, 27.5, 2, 1.5, 'w');
});

const courier = sprite(({ dot, ellipse, line, polygon, ring }) => {
    // A helmeted rider leaning into the handlebars, with a pet-supply parcel behind.
    ring(7, 25, 5, 'w'); ring(25, 25, 5, 'w');
    dot(7, 25, 'c'); dot(25, 25, 'c');
    line(7, 25, 12, 17, 'c'); line(12, 17, 19, 25, 'c');
    line(7, 25, 19, 25, 'c'); line(12, 17, 22, 17, 'C'); line(19, 25, 22, 17, 'c');
    line(23, 14, 25, 25, 'c'); line(23, 14, 27, 14, 'w');
    line(10, 17, 14, 17, 'w'); line(2, 19, 10, 19, 'C');
    // Pet-supply parcel with a small cream paw.
    polygon([[1, 12], [10, 12], [10, 20], [1, 20]], 'k');
    line(1, 12, 9, 12, 'w'); line(8, 13, 8, 18, 'K');
    dot(3, 15, 'w'); dot(5, 14, 'w'); dot(7, 15, 'w');
    ellipse(5, 17, 1.5, 1.2, 'w');
    // Rear leg, forward leg and reflective shoes.
    line(15, 16, 12, 21, 'C', 2); line(12, 21, 16, 24, 'C'); line(15, 24, 18, 24, 'w');
    line(15, 16, 20, 20, 'w', 2); line(20, 20, 18, 25, 'W'); line(17, 26, 20, 26, 'p');
    // Jacket, reaching arm, neck and face in profile.
    polygon([[16, 8], [20, 10], [18, 15], [15, 18], [12, 15], [14, 10]], 'C');
    polygon([[16, 8], [19, 10], [16, 15], [13, 14], [15, 10]], 'c');
    line(19, 10, 21, 13, 'c', 2); line(21, 14, 25, 14, 'w');
    line(18, 7, 18, 9, 'w');
    ellipse(18, 2.5, 3, 2, 'P');
    ellipse(18, 2, 2.5, 1.8, 'p'); line(16, 1, 18, 1, 'h');
    polygon([[18, 4], [21, 4], [21, 5], [23, 6], [21, 7], [18, 7]], 'w');
    dot(21, 5, 'v');
    line(19, 4, 22, 4, 'p');
});


export const SPRITES = { dog, cat, bowl, courier };
export const PET_ORDER = ['dog', 'cat', 'bowl'];
