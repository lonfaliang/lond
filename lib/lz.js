var LZString = function() {
    function f(h, e) {
        if (!b[h]) {
            b[h] = {};
            for (var i = 0; i < h.length; i++) {
                b[h][h.charAt(i)] = i
            }
        }
        return b[h][e]
    }

    var c = String.fromCharCode,
        g = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
        d = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$",
        b = {},
        a = {
            compressToBase64: function(h) {
                if (null == h) {
                    return ""
                }
                var e = a._compress(h, 6,
                    function(i) {
                        return g.charAt(i)
                    });
                switch (e.length % 4) {
                    default:
                    case 0:
                        return e;
                    case 1:
                        return e + "===";
                    case 2:
                        return e + "==";
                    case 3:
                        return e + "="
                }
            },
            decompressFromBase64: function(e) {
                return null == e ? "": "" == e ? null: a._decompress(e.length, 32,
                    function(h) {
                        return f(g, e.charAt(h))
                    })
            },
            compressToUTF16: function(e) {
                return null == e ? "": a._compress(e, 15,
                    function(h) {
                        return c(h + 32)
                    }) + " "
            },
            decompressFromUTF16: function(e) {
                return null == e ? "": "" == e ? null: a._decompress(e.length, 16384,
                    function(h) {
                        return e.charCodeAt(h) - 32
                    })
            },
            compressToUint8Array: function(l) {
                for (var j = a.compress(l), m = new Uint8Array(2 * j.length), k = 0, h = j.length; h > k; k++) {
                    var i = j.charCodeAt(k);
                    m[2 * k] = i >>> 8,
                        m[2 * k + 1] = i % 256
                }
                return m
            },
            decompressFromUint8Array: function(k) {
                if (null === k || void 0 === k) {
                    return a.decompress(k)
                }
                for (var l = new Array(k.length / 2), j = 0, h = l.length; h > j; j++) {
                    l[j] = 256 * k[2 * j] + k[2 * j + 1]
                }
                var i = [];
                return l.forEach(function(e) {
                    i.push(c(e))
                }),
                    a.decompress(i.join(""))
            },
            compressToEncodedURIComponent: function(e) {
                return null == e ? "": a._compress(e, 6,
                    function(h) {
                        return d.charAt(h)
                    })
            },
            decompressFromEncodedURIComponent: function(e) {
                return null == e ? "": "" == e ? null: (e = e.replace(/ /g, "+"), a._decompress(e.length, 32,
                    function(h) {
                        return f(d, e.charAt(h))
                    }))
            },
            compress: function(e) {
                return a._compress(e, 16,
                    function(h) {
                        return c(h)
                    })
            },
            _compress: function(q, j, w) {
                if (null == q) {
                    return ""
                }
                var C, I, z, J = {},
                    k = {},
                    H = "",
                    E = "",
                    F = "",
                    y = 2,
                    B = 3,
                    A = 2,
                    D = [],
                    x = 0,
                    G = 0;
                for (z = 0; z < q.length; z += 1) {
                    if (H = q.charAt(z), Object.prototype.hasOwnProperty.call(J, H) || (J[H] = B++, k[H] = !0), E = F + H, Object.prototype.hasOwnProperty.call(J, E)) {
                        F = E
                    } else {
                        if (Object.prototype.hasOwnProperty.call(k, F)) {
                            if (F.charCodeAt(0) < 256) {
                                for (C = 0; A > C; C++) {
                                    x <<= 1,
                                        G == j - 1 ? (G = 0, D.push(w(x)), x = 0) : G++
                                }
                                for (I = F.charCodeAt(0), C = 0; 8 > C; C++) {
                                    x = x << 1 | 1 & I,
                                        G == j - 1 ? (G = 0, D.push(w(x)), x = 0) : G++,
                                        I >>= 1
                                }
                            } else {
                                for (I = 1, C = 0; A > C; C++) {
                                    x = x << 1 | I,
                                        G == j - 1 ? (G = 0, D.push(w(x)), x = 0) : G++,
                                        I = 0
                                }
                                for (I = F.charCodeAt(0), C = 0; 16 > C; C++) {
                                    x = x << 1 | 1 & I,
                                        G == j - 1 ? (G = 0, D.push(w(x)), x = 0) : G++,
                                        I >>= 1
                                }
                            }
                            y--,
                            0 == y && (y = Math.pow(2, A), A++),
                                delete k[F]
                        } else {
                            for (I = J[F], C = 0; A > C; C++) {
                                x = x << 1 | 1 & I,
                                    G == j - 1 ? (G = 0, D.push(w(x)), x = 0) : G++,
                                    I >>= 1
                            }
                        }
                        y--,
                        0 == y && (y = Math.pow(2, A), A++),
                            J[E] = B++,
                            F = String(H)
                    }
                }
                if ("" !== F) {
                    if (Object.prototype.hasOwnProperty.call(k, F)) {
                        if (F.charCodeAt(0) < 256) {
                            for (C = 0; A > C; C++) {
                                x <<= 1,
                                    G == j - 1 ? (G = 0, D.push(w(x)), x = 0) : G++
                            }
                            for (I = F.charCodeAt(0), C = 0; 8 > C; C++) {
                                x = x << 1 | 1 & I,
                                    G == j - 1 ? (G = 0, D.push(w(x)), x = 0) : G++,
                                    I >>= 1
                            }
                        } else {
                            for (I = 1, C = 0; A > C; C++) {
                                x = x << 1 | I,
                                    G == j - 1 ? (G = 0, D.push(w(x)), x = 0) : G++,
                                    I = 0
                            }
                            for (I = F.charCodeAt(0), C = 0; 16 > C; C++) {
                                x = x << 1 | 1 & I,
                                    G == j - 1 ? (G = 0, D.push(w(x)), x = 0) : G++,
                                    I >>= 1
                            }
                        }
                        y--,
                        0 == y && (y = Math.pow(2, A), A++),
                            delete k[F]
                    } else {
                        for (I = J[F], C = 0; A > C; C++) {
                            x = x << 1 | 1 & I,
                                G == j - 1 ? (G = 0, D.push(w(x)), x = 0) : G++,
                                I >>= 1
                        }
                    }
                    y--,
                    0 == y && (y = Math.pow(2, A), A++)
                }
                for (I = 2, C = 0; A > C; C++) {
                    x = x << 1 | 1 & I,
                        G == j - 1 ? (G = 0, D.push(w(x)), x = 0) : G++,
                        I >>= 1
                }
                for (;;) {
                    if (x <<= 1, G == j - 1) {
                        D.push(w(x));
                        break
                    }
                    G++
                }
                return D.join("")
            },
            decompress: function(e) {
                return null == e ? "": "" == e ? null: a._decompress(e.length, 32768,
                    function(h) {
                        return e.charCodeAt(h)
                    })
            },
            _decompress: function(B, C, I) {
                var r, F, x, z, q, K, L, E, H = [],
                    G = 4,
                    J = 4,
                    D = 3,
                    k = "",
                    j = [],
                    y = {
                        val: I(0),
                        position: C,
                        index: 1
                    };
                for (F = 0; 3 > F; F += 1) {
                    H[F] = F
                }
                for (z = 0, K = Math.pow(2, 2), L = 1; L != K;) {
                    q = y.val & y.position,
                        y.position >>= 1,
                    0 == y.position && (y.position = C, y.val = I(y.index++)),
                        z |= (q > 0 ? 1 : 0) * L,
                        L <<= 1
                }
                switch (r = z) {
                    case 0:
                        for (z = 0, K = Math.pow(2, 8), L = 1; L != K;) {
                            q = y.val & y.position,
                                y.position >>= 1,
                            0 == y.position && (y.position = C, y.val = I(y.index++)),
                                z |= (q > 0 ? 1 : 0) * L,
                                L <<= 1
                        }
                        E = c(z);
                        break;
                    case 1:
                        for (z = 0, K = Math.pow(2, 16), L = 1; L != K;) {
                            q = y.val & y.position,
                                y.position >>= 1,
                            0 == y.position && (y.position = C, y.val = I(y.index++)),
                                z |= (q > 0 ? 1 : 0) * L,
                                L <<= 1
                        }
                        E = c(z);
                        break;
                    case 2:
                        return ""
                }
                for (H[3] = E, x = E, j.push(E);;) {
                    if (y.index > B) {
                        return ""
                    }
                    for (z = 0, K = Math.pow(2, D), L = 1; L != K;) {
                        q = y.val & y.position,
                            y.position >>= 1,
                        0 == y.position && (y.position = C, y.val = I(y.index++)),
                            z |= (q > 0 ? 1 : 0) * L,
                            L <<= 1
                    }
                    switch (E = z) {
                        case 0:
                            for (z = 0, K = Math.pow(2, 8), L = 1; L != K;) {
                                q = y.val & y.position,
                                    y.position >>= 1,
                                0 == y.position && (y.position = C, y.val = I(y.index++)),
                                    z |= (q > 0 ? 1 : 0) * L,
                                    L <<= 1
                            }
                            H[J++] = c(z),
                                E = J - 1,
                                G--;
                            break;
                        case 1:
                            for (z = 0, K = Math.pow(2, 16), L = 1; L != K;) {
                                q = y.val & y.position,
                                    y.position >>= 1,
                                0 == y.position && (y.position = C, y.val = I(y.index++)),
                                    z |= (q > 0 ? 1 : 0) * L,
                                    L <<= 1
                            }
                            H[J++] = c(z),
                                E = J - 1,
                                G--;
                            break;
                        case 2:
                            return j.join("")
                    }
                    if (0 == G && (G = Math.pow(2, D), D++), H[E]) {
                        k = H[E]
                    } else {
                        if (E !== J) {
                            return null
                        }
                        k = x + x.charAt(0)
                    }
                    j.push(k),
                        H[J++] = x + k.charAt(0),
                        G--,
                        x = k,
                    0 == G && (G = Math.pow(2, D), D++)
                }
            }
        };
    return a
} ();

module.exports = LZString