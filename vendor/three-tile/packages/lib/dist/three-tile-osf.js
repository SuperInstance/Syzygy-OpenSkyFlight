import { Box2 as e, Box3 as t, Box3Helper as n, BufferAttribute as r, BufferGeometry as i, CanvasTexture as a, Clock as o, FileLoader as s, FrontSide as c, Frustum as l, ImageLoader as u, LinearFilter as d, LoadingManager as f, MathUtils as p, Matrix3 as m, Matrix4 as h, Mesh as g, MeshBasicNodeMaterial as _, MeshStandardNodeMaterial as v, Object3D as y, Raycaster as b, SRGBColorSpace as x, Texture as S, Vector2 as C, Vector3 as w, WebGLCoordinateSystem as T } from "three";
import { Fn as E, cross as ee, float as D, positionLocal as te, texture as O, transformNormalToView as ne, uv as re, varying as ie, vec2 as ae, vec3 as k } from "three/tsl";
import { WorkerPool as oe } from "three/examples/jsm/utils/WorkerPool.js";
//#region package.json
var A = "0.11.8-osf", se = {
	name: "GuoJF",
	email: "hz_gjf@163.com"
};
//#endregion
//#region \0@oxc-project+runtime@0.152.0/helpers/esm/typeof.js
function j(e) {
	"@babel/helpers - typeof";
	return j = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
		return typeof e;
	} : function(e) {
		return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
	}, j(e);
}
//#endregion
//#region \0@oxc-project+runtime@0.152.0/helpers/esm/toPrimitive.js
function ce(e, t) {
	if (j(e) != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (j(r) != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
//#endregion
//#region \0@oxc-project+runtime@0.152.0/helpers/esm/toPropertyKey.js
function le(e) {
	var t = ce(e, "string");
	return j(t) == "symbol" ? t : t + "";
}
//#endregion
//#region \0@oxc-project+runtime@0.152.0/helpers/esm/defineProperty.js
function M(e, t, n) {
	return (t = le(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
//#endregion
//#region src/tile/FrustumEx.ts
var ue = new m();
function de(e, t, n, r) {
	let i = ue.set(e.normal.x, e.normal.y, e.normal.z, t.normal.x, t.normal.y, t.normal.z, n.normal.x, n.normal.y, n.normal.z);
	return r.set(-e.constant, -t.constant, -n.constant), r.applyMatrix3(i.invert()), r;
}
var fe = class extends l {
	constructor() {
		super(), M(this, "points", void 0), this.points = Array(8).fill(0).map(() => new w());
	}
	setFromProjectionMatrix(e, t = T) {
		return super.setFromProjectionMatrix(e, t), this.calculateFrustumPoints(), this;
	}
	calculateFrustumPoints() {
		let { planes: e, points: t } = this;
		[
			[
				e[0],
				e[3],
				e[4]
			],
			[
				e[1],
				e[3],
				e[4]
			],
			[
				e[0],
				e[2],
				e[4]
			],
			[
				e[1],
				e[2],
				e[4]
			],
			[
				e[0],
				e[3],
				e[5]
			],
			[
				e[1],
				e[3],
				e[5]
			],
			[
				e[0],
				e[2],
				e[5]
			],
			[
				e[1],
				e[2],
				e[5]
			]
		].forEach((e, n) => {
			de(e[0], e[1], e[2], t[n]);
		});
	}
}, pe = /* @__PURE__ */ function(e) {
	return e[e.none = 0] = "none", e[e.create = 1] = "create", e[e.remove = 2] = "remove", e;
}({});
function me(e, t, n, r) {
	if (!e.isLeaf && e.z > n) return 2;
	let i = e.distRatio, a = r;
	if (e.z > 13) {
		let t = 1.4 ** (e.z - 13), n = e.viewCenterFactor;
		a = r * (1 + (t - 1) * n);
	}
	return e.isLeaf && e.inFrustum && e.z < n && i < a && (e.showing || e.z <= t) ? 1 : !e.isLeaf && e.z >= t && i > a * 1.2 ? 2 : 0;
}
function N(e, t, n, r, i, a, o, s) {
	let c = new I(e, t, n);
	return c.position.set(r, i, 0), c.scale.set(a, o, s), c.updateMatrix(), c;
}
function he(e, t) {
	let { x: n, y: r, z: i } = e, a = [], o = n * 2, s = i + 1, c = .25, l = .5;
	if (i === 0 && t.projectionID === "4326") {
		let e = r, t = N(o, e, s, -.25, 0, l, 1, 1), n = N(o + 1, e, s, c, 0, l, 1, 1);
		a.push(t, n);
	} else {
		let e = r * 2, t = .5, n = N(o, e, s, -.25, c, l, t, 1), i = N(o + 1, e, s, c, c, l, t, 1), u = N(o, e + 1, s, -.25, -.25, l, t, 1), d = N(o + 1, e + 1, s, c, -.25, l, t, 1);
		a.push(n, i, u, d);
	}
	return a;
}
//#endregion
//#region src/tile/Tile.ts
var ge = 10, P = new w(), F = new w(), _e = 1, ve = new fe(), ye = new h(), be = new w(), I = class e extends y {
	get model() {
		return this._model;
	}
	get subTiles() {
		return this._subTiles;
	}
	get distRatio() {
		let e = P.distanceTo(this._checkPoint) / this._sizeInWorld;
		return this.inFrustum ? e * .8 : e * 2;
	}
	get viewCenterFactor() {
		let e = this._checkPoint.x - F.x, t = this._checkPoint.z - F.z, n = Math.sqrt(e * e + t * t);
		return Math.max(0, Math.min(1, 1 - n / _e));
	}
	get inFrustum() {
		return !!this._bbox && ve.intersectsBox(this._bbox);
	}
	get isLeaf() {
		return !this.subTiles;
	}
	get showing() {
		return !!this.model?.visible;
	}
	set showing(e) {
		this.model ? (e && (this.model.castShadow = this._root.castShadow, this.model.receiveShadow = this._root.receiveShadow), e != this.showing && (this.model.traverse((t) => t.layers.set(e ? 0 : 31)), this.model.visible = e, this._root.dispatchEvent({
			type: "tile-visible-changed",
			tile: this,
			visible: e
		}))) : console.assert(!e);
	}
	get _isDirty() {
		return !!this.model && (this._updateMaterial || this._updateGeometry);
	}
	constructor(e = 0, t = 0, n = 0) {
		super(), M(this, "x", void 0), M(this, "y", void 0), M(this, "z", void 0), M(this, "isTile", !0), M(this, "_isLoading", !1), M(this, "_root", this), M(this, "_checkPoint", new w()), M(this, "_sizeInWorld", -1), M(this, "_bbox", null), M(this, "_model", void 0), M(this, "_subTiles", void 0), M(this, "_updateMaterial", !1), M(this, "_updateGeometry", !1), this.x = e, this.y = t, this.z = n, this.name = `Tile ${n}-${e}-${t}`, this.up.set(0, 0, 1), this.matrixAutoUpdate = !1;
	}
	raycast(e) {
		return this.inFrustum;
	}
	computeTileSize(e) {
		if (this._bbox = new t(new w(-.5, -.5), new w(.5, .5)).applyMatrix4(this.matrixWorld), this._checkPoint = new w().applyMatrix4(this.matrixWorld), this._sizeInWorld = this._bbox.getSize(be).length(), console.assert(this._sizeInWorld > 10), this._bbox.min.setY(-300), this._bbox.max.setY(9e3), e > 1) {
			let e = this._bbox.clone().applyMatrix4(this.matrixWorld.clone().invert()), t = new n(e, 1044480);
			t.name = "tilebox", this.add(t);
		}
		return this._sizeInWorld;
	}
	update(t) {
		if (!this.parent || this._isLoading) return;
		this.parent instanceof e && (this._root = this.parent._root), console.assert(this._root.z === 0);
		let { loader: n, minLevel: r, camera: i } = t;
		if (this.z === 0) {
			i.getWorldPosition(P), ve.setFromProjectionMatrix(ye.multiplyMatrices(i.projectionMatrix, i.matrixWorldInverse));
			let e = i.getWorldDirection(be);
			if (e.y < -.01) {
				let t = -P.y / e.y;
				F.copy(e).multiplyScalar(t).add(P);
			} else F.copy(e).multiplyScalar(5e4).add(P), F.y = 0;
			_e = Math.max(500, P.y * 2);
		}
		if (this._sizeInWorld < 0 && this.computeTileSize(n.debug), this.z >= r && n.downloadingThreads < ge) {
			if (!this.model) {
				this._startLoad(n);
				return;
			}
			if (this._isDirty && this.inFrustum && !this.subTiles?.some((e) => e._isDirty)) {
				this._startUpdate(n);
				return;
			}
		}
		this.model && (this.model.castShadow = this._root.castShadow, this.model.receiveShadow = this._root.receiveShadow), this.LOD(t), this.subTiles?.forEach((e) => e.update(t));
	}
	LOD(e) {
		let { loader: t, minLevel: n, maxLevel: r, LODThreshold: i } = e, a = me(this, n, r, i);
		if (a === pe.create) {
			let e = he(this, t);
			this.add(...e), this._subTiles = e, this._subTiles.forEach((e) => {
				e.updateMatrixWorld(), this._root.dispatchEvent({
					type: "tile-created",
					tile: e
				});
			});
		} else a === pe.remove && this.model && (this.showing = !0, this.unLoad(t, !1));
		return a;
	}
	_checkVisible() {
		let t = this.parent;
		if (t instanceof e) {
			if (t.model) {
				let e = t.subTiles;
				if (e) {
					let n = !e.some((e) => !e.model);
					e.forEach((e) => e.showing = n), t.showing = !n;
				}
			} else this.showing = !0;
		}
		return this;
	}
	async _startLoad(e) {
		this._isLoading = !0, this._model = await e.load(this), this._model.geometry.computeBoundingBox(), this._checkPoint.y = this._model.geometry.boundingBox?.max.z || 0, this.isLeaf && this._checkVisible(), this._isLoading = !1, this._root.dispatchEvent({
			type: "tile-loaded",
			tile: this
		}), this.add(this._model);
	}
	async _startUpdate(e) {
		this.model && (this._isLoading = !0, this._model = await e.update(this.model, this, this._updateMaterial, this._updateGeometry), this.model.geometry.computeBoundingBox(), this._checkPoint.y = this.model.geometry.boundingBox?.max.z || 0, this._updateMaterial = !1, this._updateGeometry = !1, this._isLoading = !1, this._root.dispatchEvent({
			type: "tile-loaded",
			tile: this
		}));
	}
	updateData(t, n) {
		return this.traverse((r) => {
			r instanceof e && (r.model || r._isLoading) && (r._updateMaterial = t, r._updateGeometry = n);
		}), this;
	}
	reload(e) {
		return this.unLoad(e, !0);
	}
	unLoad(e, t = !0) {
		return this.subTiles && (this.subTiles.forEach((t) => {
			t.unLoad(e, !0);
		}), this.remove(...this.subTiles), this._subTiles = void 0), t && this.model && (e.unload(this.model), this._root.dispatchEvent({
			type: "tile-unload",
			tile: this
		}), this._model = void 0), e.debug > 1 && this.getObjectByName("tilebox")?.geometry.dispose(), this;
	}
}, L = class extends v {
	constructor(e = {}) {
		super({
			transparent: !1,
			side: c,
			...e
		});
	}
}, R = /* @__PURE__ */ E(([e]) => e.r.mul(65280).add(e.g.mul(255)).add(e.b.mul(D(255).div(256))).sub(32768));
function xe(e, t) {
	let n = O(t), r = ie(k(0, 0, 1));
	return e.positionNode = E(() => {
		let e = te.toVar(), n = re(), i = R(O(t, n)), a = D(1).div(128), o = R(O(t, n.add(ae(a, 0)))), s = R(O(t, n.add(ae(0, a)))), c = a, l = k(c, D(0), o.sub(i)), u = k(D(0), c, s.sub(i));
		return r.assign(ee(l, u).normalize()), e.z.addAssign(i), e;
	})(), e.normalNode = ne(r), { heightTextureNode: n };
}
//#endregion
//#region src/material/vectorTileRenderer/IVectorTileRender.ts
var z = /* @__PURE__ */ function(e) {
	return e[e.Unknown = 0] = "Unknown", e[e.Point = 1] = "Point", e[e.Linestring = 2] = "Linestring", e[e.Polygon = 3] = "Polygon", e;
}({}), Se = class {
	render(e, t, n, r, i = 1) {
		switch (e.lineCap = "round", e.lineJoin = "round", (r.shadowBlur ?? 0) > 0 && (e.shadowBlur = r.shadowBlur ?? 2, e.shadowColor = r.shadowColor ?? "black", e.shadowOffsetX = r.shadowOffset ? r.shadowOffset[0] : 0, e.shadowOffsetY = r.shadowOffset ? r.shadowOffset[1] : 0), t) {
			case z.Point:
				e.textAlign = "center", e.textBaseline = "middle", e.font = r.font ?? "14px Arial", e.fillStyle = r.fontColor ?? "white", this._renderPointText(e, n, i, r.textField ?? "name", r.fontOffset ?? [0, -8]);
				break;
			case z.Linestring:
				this._renderLineString(e, n, i);
				break;
			case z.Polygon:
				this._renderPolygon(e, n, i);
				break;
			default: console.warn(`Unknown feature type: ${t}`);
		}
		(r.fill || t === z.Point) && (e.globalAlpha = r.fillOpacity || .5, e.fillStyle = r.fillColor || r.color || "#3388ff", e.fill(r.fillRule || "evenodd")), (r.stroke ?? !0) && (r.weight ?? 1) > 0 && (e.globalAlpha = r.opacity || 1, e.lineWidth = r.weight || 1, e.strokeStyle = r.color || "#3388ff", e.setLineDash(r.dashArray || []), e.stroke());
	}
	_renderPointText(e, t, n = 1, r = "name", i = [0, 0]) {
		let a = t.geometry;
		e.beginPath();
		for (let t of a) for (let r = 0; r < t.length; r++) {
			let i = t[r];
			e.arc(i.x * n, i.y * n, 2, 0, 2 * Math.PI);
		}
		let o = t.properties;
		o && o[r] && e.fillText(o[r], a[0][0].x * n + i[0], a[0][0].y * n + i[1]);
	}
	_renderLineString(e, t, n) {
		let r = t.geometry;
		e.beginPath();
		for (let t of r) for (let r = 0; r < t.length; r++) {
			let { x: i, y: a } = t[r];
			r === 0 ? e.moveTo(i * n, a * n) : e.lineTo(i * n, a * n);
		}
	}
	_renderPolygon(e, t, n) {
		let r = t.geometry;
		e.beginPath();
		for (let t = 0; t < r.length; t++) {
			let i = r[t];
			for (let t = 0; t < i.length; t++) {
				let { x: r, y: a } = i[t];
				t === 0 ? e.moveTo(r * n, a * n) : e.lineTo(r * n, a * n);
			}
			e.closePath();
		}
	}
};
//#endregion
//#region src/geometry/skirt.ts
function B(...e) {
	let t = e, n = t && t.length > 1 && t[0].constructor || null;
	if (!n) throw Error("concatenateTypedArrays - incorrect quantity of arguments or arguments have incompatible data types");
	let r = new n(t.reduce((e, t) => e + t.length, 0)), i = 0;
	for (let e of t) r.set(e, i), i += e.length;
	return r;
}
function Ce(e, t, n, r) {
	let i = r ? Te(r, e.position.value) : we(t), a = i.length, o = new Float32Array(a * 6), s = new Float32Array(a * 4), c = new t.constructor(a * 6), l = new Float32Array(a * 6);
	for (let t = 0; t < a; t++) Ee({
		edge: i[t],
		edgeIndex: t,
		attributes: e,
		skirtHeight: n,
		newPosition: o,
		newTexcoord0: s,
		newTriangles: c,
		newNormals: l
	});
	return e.position.value = B(e.position.value, o), e.texcoord.value = B(e.texcoord.value, s), e.normal.value = B(e.normal.value, l), {
		attributes: e,
		indices: B(t, c)
	};
}
function we(e) {
	let t = [], n = Array.isArray(e) ? e : Array.from(e);
	for (let e = 0; e < n.length; e += 3) {
		let r = n[e], i = n[e + 1], a = n[e + 2];
		t.push([r, i], [i, a], [a, r]);
	}
	t.sort(([e, t], [n, r]) => {
		let i = Math.min(e, t), a = Math.min(n, r);
		return i === a ? Math.max(e, t) - Math.max(n, r) : i - a;
	});
	let r = [];
	for (let e = 0; e < t.length; e++) e + 1 < t.length && t[e][0] === t[e + 1][1] && t[e][1] === t[e + 1][0] ? e++ : r.push(t[e]);
	return r;
}
function Te(e, t) {
	let n = (e, t) => {
		e.sort(t);
	};
	n(e.westIndices, (e, n) => t[3 * e + 1] - t[3 * n + 1]), n(e.eastIndices, (e, n) => t[3 * n + 1] - t[3 * e + 1]), n(e.southIndices, (e, n) => t[3 * n] - t[3 * e]), n(e.northIndices, (e, n) => t[3 * e] - t[3 * n]);
	let r = [];
	return Object.values(e).forEach((e) => {
		if (e.length > 1) for (let t = 0; t < e.length - 1; t++) r.push([e[t], e[t + 1]]);
	}), r;
}
function Ee({ edge: e, edgeIndex: t, attributes: n, skirtHeight: r, newPosition: i, newTexcoord0: a, newTriangles: o, newNormals: s }) {
	let c = n.position.value.length, l = t * 2, u = l + 1;
	i.set(n.position.value.subarray(e[0] * 3, e[0] * 3 + 3), l * 3), i[l * 3 + 2] = i[l * 3 + 2] - r, i.set(n.position.value.subarray(e[1] * 3, e[1] * 3 + 3), u * 3), i[u * 3 + 2] = i[u * 3 + 2] - r, a.set(n.texcoord.value.subarray(e[0] * 2, e[0] * 2 + 2), l * 2), a.set(n.texcoord.value.subarray(e[1] * 2, e[1] * 2 + 2), u * 2);
	let d = t * 2 * 3;
	o[d] = e[0], o[d + 1] = c / 3 + u, o[d + 2] = e[1], o[d + 3] = c / 3 + u, o[d + 4] = e[0], o[d + 5] = c / 3 + l, s[d] = 0, s[d + 1] = 0, s[d + 2] = 1, s[d + 3] = 0, s[d + 4] = 0, s[d + 5] = 1;
}
//#endregion
//#region src/geometry/utils.ts
function De(e) {
	if (e.length < 4) throw Error(`DEM array must > 4, got ${e.length}!`);
	let t = Math.floor(Math.sqrt(e.length)), n = t, r = t, i = V(r, n);
	return {
		attributes: Oe(e, r, n),
		indices: i
	};
}
function Oe(e, t, n) {
	let r = n * t, i = new Float32Array(r * 3), a = new Float32Array(r * 2), o = 0;
	for (let r = 0; r < t; r++) for (let s = 0; s < n; s++) {
		let c = s / (n - 1), l = r / (t - 1);
		a[o * 2] = c, a[o * 2 + 1] = l, i[o * 3] = c - .5, i[o * 3 + 1] = l - .5, i[o * 3 + 2] = e[(t - r - 1) * n + s], o++;
	}
	return {
		position: {
			value: i,
			size: 3
		},
		texcoord: {
			value: a,
			size: 2
		},
		normal: {
			value: H(i, V(t, n)),
			size: 3
		}
	};
}
function V(e, t) {
	let n = 6 * (t - 1) * (e - 1), r = new Uint16Array(n), i = 0;
	for (let n = 0; n < e - 1; n++) for (let e = 0; e < t - 1; e++) {
		let a = n * t + e, o = a + 1, s = a + t, c = s + 1, l = i * 6;
		r[l] = a, r[l + 1] = o, r[l + 2] = s, r[l + 3] = s, r[l + 4] = o, r[l + 5] = c, i++;
	}
	return r;
}
function H(e, t) {
	let n = new Float32Array(e.length);
	for (let r = 0; r < t.length; r += 3) {
		let i = t[r] * 3, a = t[r + 1] * 3, o = t[r + 2] * 3, s = e[i], c = e[i + 1], l = e[i + 2], u = e[a], d = e[a + 1], f = e[a + 2], p = e[o], m = e[o + 1], h = e[o + 2], g = u - s, _ = d - c, v = f - l, y = p - s, b = m - c, x = h - l, S = _ * x - v * b, C = v * y - g * x, w = g * b - _ * y, T = Math.sqrt(S * S + C * C + w * w), E = [
			0,
			0,
			1
		];
		if (T > 0) {
			let e = 1 / T;
			E[0] = S * e, E[1] = C * e, E[2] = w * e;
		}
		for (let e = 0; e < 3; e++) n[i + e] = n[a + e] = n[o + e] = E[e];
	}
	return n;
}
//#endregion
//#region src/geometry/TileGeometry.ts
var U = class extends i {
	constructor() {
		super(), M(this, "type", "TileGeometry");
		let e = new Float32Array([
			0,
			0,
			0,
			0,
			1,
			0,
			1,
			1,
			0,
			1,
			0,
			0
		]);
		this.setData(e);
	}
	setData(e, t = 1e3) {
		let n = e instanceof Float32Array ? De(e) : e;
		n = Ce(n.attributes, n.indices, t);
		let { attributes: i, indices: a } = n;
		return this.setIndex(new r(a, 1)), this.setAttribute("position", new r(i.position.value, i.position.size)), this.setAttribute("uv", new r(i.texcoord.value, i.texcoord.size)), this.setAttribute("normal", new r(i.normal.value, i.normal.size)), this.computeBoundingBox(), this.computeBoundingSphere(), this;
	}
}, ke = class {
	constructor(e = 257) {
		M(this, "gridSize", void 0), M(this, "numTriangles", void 0), M(this, "numParentTriangles", void 0), M(this, "indices", void 0), M(this, "coords", void 0), this.gridSize = e;
		let t = e - 1;
		if (t & t - 1) throw Error(`Expected grid size to be 2^n+1, got ${e}.`);
		this.numTriangles = t * t * 2 - 2, this.numParentTriangles = this.numTriangles - t * t, this.indices = new Uint32Array(this.gridSize * this.gridSize), this.coords = new Uint16Array(this.numTriangles * 4);
		for (let e = 0; e < this.numTriangles; e++) {
			let n = e + 2, r = 0, i = 0, a = 0, o = 0, s = 0, c = 0;
			for (n & 1 ? a = o = s = t : r = i = c = t; (n >>= 1) > 1;) {
				let e = r + a >> 1, t = i + o >> 1;
				n & 1 ? (a = r, o = i, r = s, i = c) : (r = a, i = o, a = s, o = c), s = e, c = t;
			}
			let l = e * 4;
			this.coords[l + 0] = r, this.coords[l + 1] = i, this.coords[l + 2] = a, this.coords[l + 3] = o;
		}
	}
	createTile(e) {
		return new Ae(e, this);
	}
}, Ae = class {
	constructor(e, t) {
		M(this, "martini", void 0), M(this, "terrain", void 0), M(this, "errors", void 0);
		let n = t.gridSize;
		if (e.length !== n * n) throw Error(`Expected terrain data of length ${n * n} (${n} x ${n}), got ${e.length}.`);
		this.terrain = e, this.martini = t, this.errors = new Float32Array(e.length), this.update();
	}
	update() {
		let { numTriangles: e, numParentTriangles: t, coords: n, gridSize: r } = this.martini, { terrain: i, errors: a } = this;
		for (let o = e - 1; o >= 0; o--) {
			let e = o * 4, s = n[e + 0], c = n[e + 1], l = n[e + 2], u = n[e + 3], d = s + l >> 1, f = c + u >> 1, p = d + f - c, m = f + s - d, h = (i[c * r + s] + i[u * r + l]) / 2, g = f * r + d, _ = Math.abs(h - i[g]);
			if (a[g] = Math.max(a[g], _), o < t) {
				let e = (c + m >> 1) * r + (s + p >> 1), t = (u + m >> 1) * r + (l + p >> 1);
				a[g] = Math.max(a[g], a[e], a[t]);
			}
		}
	}
	getGeometryData(e = 0) {
		let { gridSize: t, indices: n } = this.martini, { errors: r } = this, i = 0, a = 0, o = t - 1, s, c, l = 0;
		n.fill(0);
		function u(o, d, f, p, m, h) {
			let g = o + f >> 1, _ = d + p >> 1;
			Math.abs(o - m) + Math.abs(d - h) > 1 && r[_ * t + g] > e ? (u(m, h, o, d, g, _), u(f, p, m, h, g, _)) : (s = d * t + o, c = p * t + f, l = h * t + m, n[s] === 0 && (n[s] = ++i), n[c] === 0 && (n[c] = ++i), n[l] === 0 && (n[l] = ++i), a++);
		}
		u(0, 0, o, o, o, 0), u(o, o, 0, 0, 0, o);
		let d = i * 2, f = a * 3, p = new Uint16Array(d), m = new Uint32Array(f), h = 0;
		function g(i, a, o, s, c, l) {
			let u = i + o >> 1, d = a + s >> 1;
			if (Math.abs(i - c) + Math.abs(a - l) > 1 && r[d * t + u] > e) g(c, l, i, a, u, d), g(o, s, c, l, u, d);
			else {
				let e = n[a * t + i] - 1, r = n[s * t + o] - 1, u = n[l * t + c] - 1;
				p[2 * e] = i, p[2 * e + 1] = a, p[2 * r] = o, p[2 * r + 1] = s, p[2 * u] = c, p[2 * u + 1] = l, m[h++] = e, m[h++] = r, m[h++] = u;
			}
		}
		return g(0, 0, o, o, o, 0), g(o, o, 0, 0, 0, o), {
			attributes: this._getMeshAttributes(this.terrain, p, m),
			indices: m
		};
	}
	_getMeshAttributes(e, t, n) {
		let r = Math.floor(Math.sqrt(e.length)), i = r - 1, a = t.length / 2, o = new Float32Array(a * 3), s = new Float32Array(a * 2);
		for (let n = 0; n < a; n++) {
			let a = t[n * 2], c = t[n * 2 + 1], l = c * r + a;
			o[3 * n + 0] = a / i - .5, o[3 * n + 1] = .5 - c / i, o[3 * n + 2] = e[l], s[2 * n + 0] = a / i, s[2 * n + 1] = 1 - c / i;
		}
		let c = H(o, n);
		return {
			position: {
				value: o,
				size: 3
			},
			texcoord: {
				value: s,
				size: 2
			},
			normal: {
				value: c,
				size: 3
			}
		};
	}
}, je = class extends f {
	constructor(...e) {
		super(...e), M(this, "onParseEnd", void 0);
	}
	parseEnd(e) {
		this.onParseEnd && this.onParseEnd(e);
	}
}, Me = { name: "GuoJF" }, W = {
	manager: new je(),
	demLoaderMap: /* @__PURE__ */ new Map(),
	imgLoaderMap: /* @__PURE__ */ new Map(),
	registerMaterialLoader(e) {
		W.imgLoaderMap.set(e.dataType, e), e.info.author = e.info.author ?? Me.name;
	},
	registerGeometryLoader(e) {
		W.demLoaderMap.set(e.dataType, e), e.info.author = e.info.author ?? Me.name;
	},
	getMaterialLoader(e) {
		let t = typeof e == "string" ? e : e.dataType, n = W.imgLoaderMap.get(t);
		if (n) return n;
		throw `Image source dataType "${t}" is not support!`;
	},
	getGeometryLoader(e) {
		let t = typeof e == "string" ? e : e.dataType, n = W.demLoaderMap.get(t);
		if (n) return n;
		throw `Terrain source dataType "${t}" is not support!`;
	},
	getLoaders() {
		return {
			imgLoaders: Array.from(W.imgLoaderMap.values()),
			demLoaders: Array.from(W.demLoaderMap.values())
		};
	}
}, Ne = class {
	constructor(e) {
		M(this, "worker", void 0), this.worker = e();
	}
	async run(e, t) {
		return new Promise((n) => {
			this.worker.onmessage = (e) => {
				n(e.data);
			}, this.worker.postMessage(e, t);
		});
	}
	terminate() {
		this.worker.terminate();
	}
};
//#endregion
//#region src/loader/util.ts
function G(e, t) {
	return {
		sx: Math.floor(e[0] * t),
		sy: Math.floor(e[1] * t),
		sw: Math.floor((e[2] - e[0]) * t),
		sh: Math.floor((e[3] - e[1]) * t)
	};
}
function K(e, t, n, r) {
	if (r < e.minLevel) return {
		url: void 0,
		clipBounds: [
			0,
			0,
			1,
			1
		]
	};
	if (r <= e.maxLevel) return {
		url: e.getUrl(t, n, r),
		clipBounds: [
			0,
			0,
			1,
			1
		]
	};
	let i = Fe(t, n, r, e.maxLevel), a = i.parentCoord;
	return {
		url: e.getUrl(a.x, a.y, a.z),
		clipBounds: i.bounds
	};
}
function Pe(e, t) {
	let n = e.width, r = new OffscreenCanvas(n, n), i = r.getContext("2d"), { sx: a, sy: o, sw: s, sh: c } = G(t, e.width);
	return i.drawImage(e, a, o, s, c, 0, 0, n, n), r;
}
function Fe(t, n, r, i) {
	let a = r - i, o = {
		x: t >> a,
		y: n >> a,
		z: r - a
	}, s = 2 ** a, c = .5 ** a, l = t % s / s - .5 + c / 2, u = n % s / s - .5 + c / 2, d = new C(l, u), f = new e().setFromCenterAndSize(d, new C(c, c));
	return {
		parentCoord: o,
		bounds: [
			f.min.x + .5,
			f.min.y + .5,
			f.max.x + .5,
			f.max.y + .5
		]
	};
}
function Ie(e, t, n) {
	if (t[0] <= n[0] && t[1] <= n[1] && t[2] >= n[2] && t[3] >= n[3]) return e;
	let [r, i, a, o] = t, [s, c, l, u] = n;
	if (Math.max(r, s) >= Math.min(a, l) || Math.max(i, c) >= Math.min(o, u)) return e;
	let d = new OffscreenCanvas(e.width, e.height), f = d.getContext("2d");
	f.drawImage(e, 0, 0);
	let p = Math.max(s, r), m = Math.min(l, a), h = Math.max(c, i), g = Math.min(u, o);
	f.globalCompositeOperation = "destination-in";
	let _ = l - s, v = u - c, y = (p - s) / _ * d.width, b = (m - s) / _ * d.width, x = d.height - (g - c) / v * d.height, S = d.height - (h - c) / v * d.height;
	return f.beginPath(), f.rect(y, x, b - y, S - x), f.fill(), d;
}
//#endregion
//#region src/loader/TileLoader.ts
var q = class e {
	constructor() {
		M(this, "_bounds", [
			-180,
			-85,
			180,
			85
		]), M(this, "_imgSource", []), M(this, "_demSource", void 0), M(this, "_errorMaterial", new _({
			color: 16711680,
			transparent: !0,
			opacity: 0,
			name: "error-material"
		})), M(this, "_errorGeometry", new U()), M(this, "backgroundMaterial", new _({ color: 1122867 })), M(this, "debug", 0);
	}
	get bounds() {
		return this._bounds;
	}
	set bounds(e) {
		this._bounds = e;
	}
	get downloadingThreads() {
		return e._downloadingThreads;
	}
	get imgSource() {
		return this._imgSource;
	}
	set imgSource(e) {
		this._imgSource = e;
	}
	get demSource() {
		return this._demSource;
	}
	set demSource(e) {
		this._demSource = e;
	}
	get projectionID() {
		return this.imgSource[0].projectionID;
	}
	get manager() {
		return W.manager;
	}
	async load(e) {
		let t = await this.loadGeometry(e), n = await this.loadMaterial(e);
		console.assert(!!n && !!t), t.clearGroups();
		for (let e = 0; e < n.length; e++) e === 0 && console.assert(n[e] === this.backgroundMaterial), t.addGroup(0, Infinity, e);
		return console.assert(n.length === t.groups.length), new g(t, n);
	}
	async updateGeometry(e, t) {
		let n = e.geometry;
		e.geometry = await this.loadGeometry(t), e.geometry.groups = n.groups, n.dispose();
	}
	async updateMaterial(e, t) {
		let n = Array.isArray(e.material) ? e.material : [e.material], r = await this.loadMaterial(t);
		e.material = r, e.geometry.clearGroups();
		for (let t = 0; t < r.length; t++) e.geometry.addGroup(0, Infinity, t);
		for (let e = 0; e < n.length; e++) n[e].dispose();
	}
	async update(e, t, n, r) {
		return r && await this.updateGeometry(e, t), n && await this.updateMaterial(e, t), e;
	}
	unload(e) {
		let t = Array.isArray(e.material) ? e.material : [e.material];
		for (let n = 0; n < t.length; n++) t[n].dispose(), e.geometry.groups.pop();
		e.geometry.dispose();
	}
	async loadGeometry(t) {
		let n, { bounds: r, z: i } = t;
		if (this.demSource && i >= this.demSource.minLevel && this._intersectsBounds(this.demSource, r)) {
			let r = W.getGeometryLoader(this.demSource), i = this.demSource;
			if (e._downloadingThreads++, n = await r.load({
				source: i,
				...t
			}).catch((e) => (this.debug > 0 && console.error("Load Geometry Error:", e), this._errorGeometry)).finally(() => {
				e._downloadingThreads--;
			}), n != this._errorGeometry) {
				let e = (t) => {
					r.unload && r.unload(t.target), t.target.removeEventListener("dispose", e);
				};
				n.addEventListener("dispose", e);
			}
		} else n = new U();
		return n;
	}
	async loadMaterial(t) {
		let n = [this.backgroundMaterial], { bounds: r, z: i } = t, a = this.imgSource.filter((e) => i >= e.minLevel && this._intersectsBounds(e, r));
		for (let r = 0; r < a.length; r++) {
			let i = a[r], o = W.getMaterialLoader(i);
			e._downloadingThreads++;
			let s = await o.load({
				source: i,
				...t
			}).catch((e) => (this.debug > 0 && console.error("Load Material Error:", e), this._errorMaterial)).finally(() => {
				e._downloadingThreads--;
			});
			if (s !== this._errorMaterial && s !== this.backgroundMaterial) {
				if ("map" in s && s.map instanceof S) {
					let e = s.map;
					e.image && (e.image = Ie(e.image, i._projectionBounds, t.bounds)), e.needsUpdate = !0;
				}
				s.opacity = i.opacity, s.transparent = i.transparent;
				let e = (t) => {
					o.unload && o.unload(t.target), t.target.removeEventListener("dispose", e);
				};
				s.addEventListener("dispose", e), n.push(s);
			}
		}
		return n;
	}
	_intersectsBounds(e, t) {
		let n = e._projectionBounds;
		return t[2] >= n[0] && t[3] >= n[1] && t[0] <= n[2] && t[1] <= n[3];
	}
};
M(q, "_downloadingThreads", 0);
//#endregion
//#region src/loader/TileGeometryLoader.ts
var J = class {
	constructor() {
		M(this, "info", {
			version: A,
			description: "Terrain loader base class"
		}), M(this, "dataType", "");
	}
	async load(e) {
		let { source: t, x: n, y: r, z: i } = e, { url: a, clipBounds: o } = K(t, n, r, i);
		if (!a) return new U();
		let s = await this.doLoad(a, {
			...e,
			clipBounds: o
		});
		return W.manager.parseEnd(s), s;
	}
}, Le = class {
	constructor() {
		M(this, "info", {
			version: A,
			description: "Image loader base class"
		}), M(this, "dataType", ""), M(this, "_material", new L());
	}
	get material() {
		return this._material;
	}
	set material(e) {
		this.material.dispose(), this._material = e;
	}
	async load(e) {
		let { source: t, x: n, y: r, z: i } = e, a = this.createMaterial(), { url: o, clipBounds: s } = K(t, n, r, i);
		return o && (a.map = await this.doLoad(o, {
			...e,
			clipBounds: s
		})), a;
	}
	unload(e) {
		let t = e.map;
		t && (t.image instanceof ImageBitmap && t.image.close(), t.dispose());
	}
	createMaterial() {
		return this.material.clone();
	}
	async doLoad(e, t) {
		return Promise.resolve(void 0);
	}
}, Re = class {
	constructor() {
		M(this, "info", {
			version: A,
			description: "Canvas tile abstract loader"
		}), M(this, "dataType", "");
	}
	async load(e) {
		let t = this._creatCanvasContext(256, 256);
		return this.drawTile(t, e), new L({
			transparent: !0,
			map: new a(t.canvas),
			opacity: e.source.opacity
		});
	}
	_creatCanvasContext(e, t) {
		let n = new OffscreenCanvas(e, t).getContext("2d");
		if (!n) throw Error("create canvas context failed");
		return n;
	}
	unload(e) {
		let t = e.map;
		t && (t.image instanceof ImageBitmap && t.image.close(), t.dispose());
	}
}, ze = class extends Le {
	constructor(...e) {
		super(...e), M(this, "info", {
			version: A,
			description: "Tile image loader. It can load xyz tile image."
		}), M(this, "dataType", "image"), M(this, "loader", new u(W.manager));
	}
	async doLoad(e, t) {
		let n = await this.loader.loadAsync(e), r = new S();
		r.colorSpace = x, r.image = n;
		let i = t.clipBounds;
		return i[2] - i[0] < 1 && (r.image = Pe(n, i)), r;
	}
};
//#endregion
//#region src/loader/tileImageLoader/index.ts
pt(new ze());
//#endregion
//#region src/loader/terrainLercLoader/parse.worker.ts?worker&inline
var Be = "(function(){function e(e,t){let n=new Float32Array(e.length);for(let r=0;r<t.length;r+=3){let i=t[r]*3,a=t[r+1]*3,o=t[r+2]*3,s=e[i],c=e[i+1],l=e[i+2],u=e[a],d=e[a+1],f=e[a+2],p=e[o],m=e[o+1],h=e[o+2],g=u-s,_=d-c,v=f-l,y=p-s,b=m-c,x=h-l,S=_*x-v*b,C=v*y-g*x,w=g*b-_*y,T=Math.sqrt(S*S+C*C+w*w),E=[0,0,1];if(T>0){let e=1/T;E[0]=S*e,E[1]=C*e,E[2]=w*e}for(let e=0;e<3;e++)n[i+e]=n[a+e]=n[o+e]=E[e]}return n}function t(e){\"@babel/helpers - typeof\";return t=typeof Symbol==`function`&&typeof Symbol.iterator==`symbol`?function(e){return typeof e}:function(e){return e&&typeof Symbol==`function`&&e.constructor===Symbol&&e!==Symbol.prototype?`symbol`:typeof e},t(e)}function n(e,n){if(t(e)!=`object`||!e)return e;var r=e[Symbol.toPrimitive];if(r!==void 0){var i=r.call(e,n||`default`);if(t(i)!=`object`)return i;throw TypeError(`@@toPrimitive must return a primitive value.`)}return(n===`string`?String:Number)(e)}function r(e){var r=n(e,`string`);return t(r)==`symbol`?r:r+``}function i(e,t,n){return(t=r(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var a=class{constructor(e=257){i(this,`gridSize`,void 0),i(this,`numTriangles`,void 0),i(this,`numParentTriangles`,void 0),i(this,`indices`,void 0),i(this,`coords`,void 0),this.gridSize=e;let t=e-1;if(t&t-1)throw Error(`Expected grid size to be 2^n+1, got ${e}.`);this.numTriangles=t*t*2-2,this.numParentTriangles=this.numTriangles-t*t,this.indices=new Uint32Array(this.gridSize*this.gridSize),this.coords=new Uint16Array(this.numTriangles*4);for(let e=0;e<this.numTriangles;e++){let n=e+2,r=0,i=0,a=0,o=0,s=0,c=0;for(n&1?a=o=s=t:r=i=c=t;(n>>=1)>1;){let e=r+a>>1,t=i+o>>1;n&1?(a=r,o=i,r=s,i=c):(r=a,i=o,a=s,o=c),s=e,c=t}let l=e*4;this.coords[l+0]=r,this.coords[l+1]=i,this.coords[l+2]=a,this.coords[l+3]=o}}createTile(e){return new o(e,this)}},o=class{constructor(e,t){i(this,`martini`,void 0),i(this,`terrain`,void 0),i(this,`errors`,void 0);let n=t.gridSize;if(e.length!==n*n)throw Error(`Expected terrain data of length ${n*n} (${n} x ${n}), got ${e.length}.`);this.terrain=e,this.martini=t,this.errors=new Float32Array(e.length),this.update()}update(){let{numTriangles:e,numParentTriangles:t,coords:n,gridSize:r}=this.martini,{terrain:i,errors:a}=this;for(let o=e-1;o>=0;o--){let e=o*4,s=n[e+0],c=n[e+1],l=n[e+2],u=n[e+3],d=s+l>>1,f=c+u>>1,p=d+f-c,m=f+s-d,h=(i[c*r+s]+i[u*r+l])/2,g=f*r+d,_=Math.abs(h-i[g]);if(a[g]=Math.max(a[g],_),o<t){let e=(c+m>>1)*r+(s+p>>1),t=(u+m>>1)*r+(l+p>>1);a[g]=Math.max(a[g],a[e],a[t])}}}getGeometryData(e=0){let{gridSize:t,indices:n}=this.martini,{errors:r}=this,i=0,a=0,o=t-1,s,c,l=0;n.fill(0);function u(o,d,f,p,m,h){let g=o+f>>1,_=d+p>>1;Math.abs(o-m)+Math.abs(d-h)>1&&r[_*t+g]>e?(u(m,h,o,d,g,_),u(f,p,m,h,g,_)):(s=d*t+o,c=p*t+f,l=h*t+m,n[s]===0&&(n[s]=++i),n[c]===0&&(n[c]=++i),n[l]===0&&(n[l]=++i),a++)}u(0,0,o,o,o,0),u(o,o,0,0,0,o);let d=i*2,f=a*3,p=new Uint16Array(d),m=new Uint32Array(f),h=0;function g(i,a,o,s,c,l){let u=i+o>>1,d=a+s>>1;if(Math.abs(i-c)+Math.abs(a-l)>1&&r[d*t+u]>e)g(c,l,i,a,u,d),g(o,s,c,l,u,d);else{let e=n[a*t+i]-1,r=n[s*t+o]-1,u=n[l*t+c]-1;p[2*e]=i,p[2*e+1]=a,p[2*r]=o,p[2*r+1]=s,p[2*u]=c,p[2*u+1]=l,m[h++]=e,m[h++]=r,m[h++]=u}}return g(0,0,o,o,o,0),g(o,o,0,0,0,o),{attributes:this._getMeshAttributes(this.terrain,p,m),indices:m}}_getMeshAttributes(t,n,r){let i=Math.floor(Math.sqrt(t.length)),a=i-1,o=n.length/2,s=new Float32Array(o*3),c=new Float32Array(o*2);for(let e=0;e<o;e++){let r=n[e*2],o=n[e*2+1],l=o*i+r;s[3*e+0]=r/a-.5,s[3*e+1]=.5-o/a,s[3*e+2]=t[l],c[2*e+0]=r/a,c[2*e+1]=1-o/a}let l=e(s,r);return{position:{value:s,size:3},texcoord:{value:c,size:2},normal:{value:l,size:3}}}};\n/* Copyright 2015-2021 Esri. Licensed under the Apache License, Version 2.0 (the \"License\"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 @preserve */\nlet s=(function(){var e={};e.defaultNoDataValue=-34027999387901484e22,e.decode=function(a,o){o=o||{};var s=o.encodedMaskData||o.encodedMaskData===null,c=i(a,o.inputOffset||0,s),l=o.noDataValue===null?e.defaultNoDataValue:o.noDataValue,u=t(c,o.pixelType||Float32Array,o.encodedMaskData,l,o.returnMask),d={width:c.width,height:c.height,pixelData:u.resultPixels,minValue:u.minValue,maxValue:c.pixels.maxValue,noDataValue:l};return u.resultMask&&(d.maskData=u.resultMask),o.returnEncodedMask&&c.mask&&(d.encodedMaskData=c.mask.bitset?c.mask.bitset:null),o.returnFileInfo&&(d.fileInfo=n(c),o.computeUsedBitDepths&&(d.fileInfo.bitDepths=r(c))),d};var t=function(e,t,n,r,i){var o=0,s=e.pixels.numBlocksX,c=e.pixels.numBlocksY,l=Math.floor(e.width/s),u=Math.floor(e.height/c),d=2*e.maxZError,f=Number.MAX_VALUE,p;n=n||(e.mask?e.mask.bitset:null);var m=new t(e.width*e.height),h;i&&n&&(h=new Uint8Array(e.width*e.height));for(var g=new Float32Array(l*u),_,v,y=0;y<=c;y++){var b=y===c?e.height%c:u;if(b!==0)for(var x=0;x<=s;x++){var S=x===s?e.width%s:l;if(S!==0){var C=y*e.width*u+x*l,w=e.width-S,T=e.pixels.blocks[o],E,D,O;T.encoding<2?(T.encoding===0?E=T.rawData:(a(T.stuffedData,T.bitsPerPixel,T.numValidPixels,T.offset,d,g,e.pixels.maxValue),E=g),D=0):O=T.encoding===2?0:T.offset;var k;if(n)for(v=0;v<b;v++){for(C&7&&(k=n[C>>3],k<<=C&7),_=0;_<S;_++)C&7||(k=n[C>>3]),k&128?(h&&(h[C]=1),p=T.encoding<2?E[D++]:O,f=f>p?p:f,m[C++]=p):(h&&(h[C]=0),m[C++]=r),k<<=1;C+=w}else if(T.encoding<2)for(v=0;v<b;v++){for(_=0;_<S;_++)p=E[D++],f=f>p?p:f,m[C++]=p;C+=w}else for(f=f>O?O:f,v=0;v<b;v++){for(_=0;_<S;_++)m[C++]=O;C+=w}if(T.encoding===1&&D!==T.numValidPixels)throw`Block and Mask do not match`;o++}}}return{resultPixels:m,resultMask:h,minValue:f}},n=function(e){return{fileIdentifierString:e.fileIdentifierString,fileVersion:e.fileVersion,imageType:e.imageType,height:e.height,width:e.width,maxZError:e.maxZError,eofOffset:e.eofOffset,mask:e.mask?{numBlocksX:e.mask.numBlocksX,numBlocksY:e.mask.numBlocksY,numBytes:e.mask.numBytes,maxValue:e.mask.maxValue}:null,pixels:{numBlocksX:e.pixels.numBlocksX,numBlocksY:e.pixels.numBlocksY,numBytes:e.pixels.numBytes,maxValue:e.pixels.maxValue,noDataValue:e.noDataValue}}},r=function(e){for(var t=e.pixels.numBlocksX*e.pixels.numBlocksY,n={},r=0;r<t;r++){var i=e.pixels.blocks[r];i.encoding===0?n.float32=!0:i.encoding===1?n[i.bitsPerPixel]=!0:n[0]=!0}return Object.keys(n)},i=function(e,t,n){var r={},i=new Uint8Array(e,t,10);if(r.fileIdentifierString=String.fromCharCode.apply(null,i),r.fileIdentifierString.trim()!==`CntZImage`)throw`Unexpected file identifier string: `+r.fileIdentifierString;t+=10;var a=new DataView(e,t,24);if(r.fileVersion=a.getInt32(0,!0),r.imageType=a.getInt32(4,!0),r.height=a.getUint32(8,!0),r.width=a.getUint32(12,!0),r.maxZError=a.getFloat64(16,!0),t+=24,!n){if(a=new DataView(e,t,16),r.mask={},r.mask.numBlocksY=a.getUint32(0,!0),r.mask.numBlocksX=a.getUint32(4,!0),r.mask.numBytes=a.getUint32(8,!0),r.mask.maxValue=a.getFloat32(12,!0),t+=16,r.mask.numBytes>0){var o=new Uint8Array(Math.ceil(r.width*r.height/8));a=new DataView(e,t,r.mask.numBytes);var s=a.getInt16(0,!0),c=2,l=0;do{if(s>0)for(;s--;)o[l++]=a.getUint8(c++);else{var u=a.getUint8(c++);for(s=-s;s--;)o[l++]=u}s=a.getInt16(c,!0),c+=2}while(c<r.mask.numBytes);if(s!==-32768||l<o.length)throw`Unexpected end of mask RLE encoding`;r.mask.bitset=o,t+=r.mask.numBytes}else(r.mask.numBytes|r.mask.numBlocksY|r.mask.maxValue)===0&&(r.mask.bitset=new Uint8Array(Math.ceil(r.width*r.height/8)))}a=new DataView(e,t,16),r.pixels={},r.pixels.numBlocksY=a.getUint32(0,!0),r.pixels.numBlocksX=a.getUint32(4,!0),r.pixels.numBytes=a.getUint32(8,!0),r.pixels.maxValue=a.getFloat32(12,!0),t+=16;var d=r.pixels.numBlocksX,f=r.pixels.numBlocksY,p=d+ +(r.width%d>0),m=f+ +(r.height%f>0);r.pixels.blocks=Array(p*m);for(var h=0,g=0;g<m;g++)for(var _=0;_<p;_++){var v=0,y=e.byteLength-t;a=new DataView(e,t,Math.min(10,y));var b={};r.pixels.blocks[h++]=b;var x=a.getUint8(0);if(v++,b.encoding=x&63,b.encoding>3)throw`Invalid block encoding (`+b.encoding+`)`;if(b.encoding===2){t++;continue}if(x!==0&&x!==2){if(x>>=6,b.offsetType=x,x===2)b.offset=a.getInt8(1),v++;else if(x===1)b.offset=a.getInt16(1,!0),v+=2;else if(x===0)b.offset=a.getFloat32(1,!0),v+=4;else throw`Invalid block offset type`;if(b.encoding===1){if(x=a.getUint8(v),v++,b.bitsPerPixel=x&63,x>>=6,b.numValidPixelsType=x,x===2)b.numValidPixels=a.getUint8(v),v++;else if(x===1)b.numValidPixels=a.getUint16(v,!0),v+=2;else if(x===0)b.numValidPixels=a.getUint32(v,!0),v+=4;else throw`Invalid valid pixel count type`}}if(t+=v,b.encoding!==3){var S,C;if(b.encoding===0){var w=(r.pixels.numBytes-1)/4;if(w!==Math.floor(w))throw`uncompressed block has invalid length`;S=/* @__PURE__ */ new ArrayBuffer(w*4),C=new Uint8Array(S),C.set(new Uint8Array(e,t,w*4)),b.rawData=new Float32Array(S),t+=w*4}else if(b.encoding===1){var T=Math.ceil(b.numValidPixels*b.bitsPerPixel/8),E=Math.ceil(T/4);S=/* @__PURE__ */ new ArrayBuffer(E*4),C=new Uint8Array(S),C.set(new Uint8Array(e,t,T)),b.stuffedData=new Uint32Array(S),t+=T}}}return r.eofOffset=t,r},a=function(e,t,n,r,i,a,o){var s=(1<<t)-1,c=0,l,u=0,d,f,p=Math.ceil((o-r)/i),m=e.length*4-Math.ceil(t*n/8);for(e[e.length-1]<<=8*m,l=0;l<n;l++){if(u===0&&(f=e[c++],u=32),u>=t)d=f>>>u-t&s,u-=t;else{var h=t-u;d=(f&s)<<h&s,f=e[c++],u=32-h,d+=f>>>u}a[l]=d<p?r+d*i:o}return a};return e})(),c=(function(){\"use strict\";var e={unstuff:function(e,t,n,r,i,a,o,s){var c=(1<<n)-1,l=0,u,d=0,f,p,m,h,g=e.length*4-Math.ceil(n*r/8);if(e[e.length-1]<<=8*g,i)for(u=0;u<r;u++)d===0&&(p=e[l++],d=32),d>=n?(f=p>>>d-n&c,d-=n):(m=n-d,f=(p&c)<<m&c,p=e[l++],d=32-m,f+=p>>>d),t[u]=i[f];else for(h=Math.ceil((s-a)/o),u=0;u<r;u++)d===0&&(p=e[l++],d=32),d>=n?(f=p>>>d-n&c,d-=n):(m=n-d,f=(p&c)<<m&c,p=e[l++],d=32-m,f+=p>>>d),t[u]=f<h?a+f*o:s},unstuffLUT:function(e,t,n,r,i,a){var o=(1<<t)-1,s=0,c=0,l=0,u=0,d=0,f,p=[],m=e.length*4-Math.ceil(t*n/8);e[e.length-1]<<=8*m;var h=Math.ceil((a-r)/i);for(c=0;c<n;c++)u===0&&(f=e[s++],u=32),u>=t?(d=f>>>u-t&o,u-=t):(l=t-u,d=(f&o)<<l&o,f=e[s++],u=32-l,d+=f>>>u),p[c]=d<h?r+d*i:a;return p.unshift(r),p},unstuff2:function(e,t,n,r,i,a,o,s){var c=(1<<n)-1,l=0,u,d=0,f=0,p,m,h;if(i)for(u=0;u<r;u++)d===0&&(m=e[l++],d=32,f=0),d>=n?(p=m>>>f&c,d-=n,f+=n):(h=n-d,p=m>>>f&c,m=e[l++],d=32-h,p|=(m&(1<<h)-1)<<n-h,f=h),t[u]=i[p];else{var g=Math.ceil((s-a)/o);for(u=0;u<r;u++)d===0&&(m=e[l++],d=32,f=0),d>=n?(p=m>>>f&c,d-=n,f+=n):(h=n-d,p=m>>>f&c,m=e[l++],d=32-h,p|=(m&(1<<h)-1)<<n-h,f=h),t[u]=p<g?a+p*o:s}return t},unstuffLUT2:function(e,t,n,r,i,a){var o=(1<<t)-1,s=0,c=0,l=0,u=0,d=0,f=0,p,m=[],h=Math.ceil((a-r)/i);for(c=0;c<n;c++)u===0&&(p=e[s++],u=32,f=0),u>=t?(d=p>>>f&o,u-=t,f+=t):(l=t-u,d=p>>>f&o,p=e[s++],u=32-l,d|=(p&(1<<l)-1)<<t-l,f=l),m[c]=d<h?r+d*i:a;return m.unshift(r),m},originalUnstuff:function(e,t,n,r){var i=(1<<n)-1,a=0,o,s=0,c,l,u,d=e.length*4-Math.ceil(n*r/8);for(e[e.length-1]<<=8*d,o=0;o<r;o++)s===0&&(l=e[a++],s=32),s>=n?(c=l>>>s-n&i,s-=n):(u=n-s,c=(l&i)<<u&i,l=e[a++],s=32-u,c+=l>>>s),t[o]=c;return t},originalUnstuff2:function(e,t,n,r){var i=(1<<n)-1,a=0,o,s=0,c=0,l,u,d;for(o=0;o<r;o++)s===0&&(u=e[a++],s=32,c=0),s>=n?(l=u>>>c&i,s-=n,c+=n):(d=n-s,l=u>>>c&i,u=e[a++],s=32-d,l|=(u&(1<<d)-1)<<n-d,c=d),t[o]=l;return t}},t={HUFFMAN_LUT_BITS_MAX:12,computeChecksumFletcher32:function(e){for(var t=65535,n=65535,r=e.length,i=Math.floor(r/2),a=0;i;){var o=i>=359?359:i;i-=o;do t+=e[a++]<<8,n+=t+=e[a++];while(--o);t=(t&65535)+(t>>>16),n=(n&65535)+(n>>>16)}return r&1&&(n+=t+=e[a]<<8),t=(t&65535)+(t>>>16),n=(n&65535)+(n>>>16),(n<<16|t)>>>0},readHeaderInfo:function(e,t){var n=t.ptr,r=new Uint8Array(e,n,6),i={};if(i.fileIdentifierString=String.fromCharCode.apply(null,r),i.fileIdentifierString.lastIndexOf(`Lerc2`,0)!==0)throw`Unexpected file identifier string (expect Lerc2 ): `+i.fileIdentifierString;n+=6;var a=new DataView(e,n,8),o=a.getInt32(0,!0);i.fileVersion=o,n+=4,o>=3&&(i.checksum=a.getUint32(4,!0),n+=4),a=new DataView(e,n,12),i.height=a.getUint32(0,!0),i.width=a.getUint32(4,!0),n+=8,o>=4?(i.numDims=a.getUint32(8,!0),n+=4):i.numDims=1,a=new DataView(e,n,40),i.numValidPixel=a.getUint32(0,!0),i.microBlockSize=a.getInt32(4,!0),i.blobSize=a.getInt32(8,!0),i.imageType=a.getInt32(12,!0),i.maxZError=a.getFloat64(16,!0),i.zMin=a.getFloat64(24,!0),i.zMax=a.getFloat64(32,!0),n+=40,t.headerInfo=i,t.ptr=n;var s,c;if(o>=3&&(c=o>=4?52:48,s=this.computeChecksumFletcher32(new Uint8Array(e,n-c,i.blobSize-14)),s!==i.checksum))throw`Checksum failed.`;return!0},checkMinMaxRanges:function(e,t){var n=t.headerInfo,r=this.getDataTypeArray(n.imageType),i=n.numDims*this.getDataTypeSize(n.imageType),a=this.readSubArray(e,t.ptr,r,i),o=this.readSubArray(e,t.ptr+i,r,i);t.ptr+=2*i;var s,c=!0;for(s=0;s<n.numDims;s++)if(a[s]!==o[s]){c=!1;break}return n.minValues=a,n.maxValues=o,c},readSubArray:function(e,t,n,r){var i;if(n===Uint8Array)i=new Uint8Array(e,t,r);else{var a=new ArrayBuffer(r);new Uint8Array(a).set(new Uint8Array(e,t,r)),i=new n(a)}return i},readMask:function(e,t){var n=t.ptr,r=t.headerInfo,i=r.width*r.height,a=r.numValidPixel,o=new DataView(e,n,4),s={};if(s.numBytes=o.getUint32(0,!0),n+=4,(a===0||i===a)&&s.numBytes!==0)throw`invalid mask`;var c,l;if(a===0)c=new Uint8Array(Math.ceil(i/8)),s.bitset=c,l=new Uint8Array(i),t.pixels.resultMask=l,n+=s.numBytes;else if(s.numBytes>0){c=new Uint8Array(Math.ceil(i/8)),o=new DataView(e,n,s.numBytes);var u=o.getInt16(0,!0),d=2,f=0,p=0;do{if(u>0)for(;u--;)c[f++]=o.getUint8(d++);else for(p=o.getUint8(d++),u=-u;u--;)c[f++]=p;u=o.getInt16(d,!0),d+=2}while(d<s.numBytes);if(u!==-32768||f<c.length)throw`Unexpected end of mask RLE encoding`;l=new Uint8Array(i);var m=0,h=0;for(h=0;h<i;h++)h&7?(m=c[h>>3],m<<=h&7):m=c[h>>3],m&128&&(l[h]=1);t.pixels.resultMask=l,s.bitset=c,n+=s.numBytes}return t.ptr=n,t.mask=s,!0},readDataOneSweep:function(e,n,r,i){var a=n.ptr,o=n.headerInfo,s=o.numDims,c=o.width*o.height,l=o.imageType,u=o.numValidPixel*t.getDataTypeSize(l)*s,d,f=n.pixels.resultMask;if(r===Uint8Array)d=new Uint8Array(e,a,u);else{var p=new ArrayBuffer(u);new Uint8Array(p).set(new Uint8Array(e,a,u)),d=new r(p)}if(d.length===c*s)i?n.pixels.resultPixels=t.swapDimensionOrder(d,c,s,r,!0):n.pixels.resultPixels=d;else{n.pixels.resultPixels=new r(c*s);var m=0,h=0,g=0,_=0;if(s>1){if(i){for(h=0;h<c;h++)if(f[h])for(_=h,g=0;g<s;g++,_+=c)n.pixels.resultPixels[_]=d[m++]}else for(h=0;h<c;h++)if(f[h])for(_=h*s,g=0;g<s;g++)n.pixels.resultPixels[_+g]=d[m++]}else for(h=0;h<c;h++)f[h]&&(n.pixels.resultPixels[h]=d[m++])}return a+=u,n.ptr=a,!0},readHuffmanTree:function(e,r){var i=this.HUFFMAN_LUT_BITS_MAX,a=new DataView(e,r.ptr,16);if(r.ptr+=16,a.getInt32(0,!0)<2)throw`unsupported Huffman version`;var o=a.getInt32(4,!0),s=a.getInt32(8,!0),c=a.getInt32(12,!0);if(s>=c)return!1;var l=new Uint32Array(c-s);t.decodeBits(e,r,l);for(var u=[],d=s,f,p,m;d<c;d++)f=d-(d<o?0:o),u[f]={first:l[d-s],second:null};var h=e.byteLength-r.ptr,g=Math.ceil(h/4),_=/* @__PURE__ */ new ArrayBuffer(g*4);new Uint8Array(_).set(new Uint8Array(e,r.ptr,h));var v=new Uint32Array(_),y=0,b,x=0;for(b=v[0],d=s;d<c;d++)f=d-(d<o?0:o),m=u[f].first,m>0&&(u[f].second=b<<y>>>32-m,32-y>=m?(y+=m,y===32&&(y=0,x++,b=v[x])):(y+=m-32,x++,b=v[x],u[f].second|=b>>>32-y));var S=0,C=0,w=new n;for(d=0;d<u.length;d++)u[d]!==void 0&&(S=Math.max(S,u[d].first));C=S>=i?i:S;var T=[],E,D,O,k,A,j;for(d=s;d<c;d++)if(f=d-(d<o?0:o),m=u[f].first,m>0){if(E=[m,f],m<=C)for(D=u[f].second<<C-m,O=1<<C-m,p=0;p<O;p++)T[D|p]=E;else for(D=u[f].second,j=w,k=m-1;k>=0;k--)A=D>>>k&1,A?(j.right||(j.right=new n),j=j.right):(j.left||(j.left=new n),j=j.left),k===0&&!j.val&&(j.val=E[1])}return{decodeLut:T,numBitsLUTQick:C,numBitsLUT:S,tree:w,stuffedData:v,srcPtr:x,bitPos:y}},readHuffman:function(e,n,r,i){var a=n.headerInfo.numDims,o=n.headerInfo.height,s=n.headerInfo.width,c=s*o,l=this.readHuffmanTree(e,n),u=l.decodeLut,d=l.tree,f=l.stuffedData,p=l.srcPtr,m=l.bitPos,h=l.numBitsLUTQick,g=l.numBitsLUT,_=n.headerInfo.imageType===0?128:0,v,y,b,x=n.pixels.resultMask,S,C,w,T,E,D,O,k=0;m>0&&(p++,m=0);var A=f[p],j=n.encodeMode===1,M=new r(c*a),N=M,P;if(a<2||j){for(P=0;P<a;P++)if(a>1&&(N=new r(M.buffer,c*P,c),k=0),n.headerInfo.numValidPixel===s*o)for(D=0,T=0;T<o;T++)for(E=0;E<s;E++,D++){if(y=0,S=A<<m>>>32-h,C=S,32-m<h&&(S|=f[p+1]>>>64-m-h,C=S),u[C])y=u[C][1],m+=u[C][0];else for(S=A<<m>>>32-g,C=S,32-m<g&&(S|=f[p+1]>>>64-m-g,C=S),v=d,O=0;O<g;O++)if(w=S>>>g-O-1&1,v=w?v.right:v.left,!(v.left||v.right)){y=v.val,m=m+O+1;break}m>=32&&(m-=32,p++,A=f[p]),b=y-_,j?(b+=E>0?k:T>0?N[D-s]:k,b&=255,N[D]=b,k=b):N[D]=b}else for(D=0,T=0;T<o;T++)for(E=0;E<s;E++,D++)if(x[D]){if(y=0,S=A<<m>>>32-h,C=S,32-m<h&&(S|=f[p+1]>>>64-m-h,C=S),u[C])y=u[C][1],m+=u[C][0];else for(S=A<<m>>>32-g,C=S,32-m<g&&(S|=f[p+1]>>>64-m-g,C=S),v=d,O=0;O<g;O++)if(w=S>>>g-O-1&1,v=w?v.right:v.left,!(v.left||v.right)){y=v.val,m=m+O+1;break}m>=32&&(m-=32,p++,A=f[p]),b=y-_,j?(E>0&&x[D-1]?b+=k:T>0&&x[D-s]?b+=N[D-s]:b+=k,b&=255,N[D]=b,k=b):N[D]=b}}else for(D=0,T=0;T<o;T++)for(E=0;E<s;E++)if(D=T*s+E,!x||x[D])for(P=0;P<a;P++,D+=c){if(y=0,S=A<<m>>>32-h,C=S,32-m<h&&(S|=f[p+1]>>>64-m-h,C=S),u[C])y=u[C][1],m+=u[C][0];else for(S=A<<m>>>32-g,C=S,32-m<g&&(S|=f[p+1]>>>64-m-g,C=S),v=d,O=0;O<g;O++)if(w=S>>>g-O-1&1,v=w?v.right:v.left,!(v.left||v.right)){y=v.val,m=m+O+1;break}m>=32&&(m-=32,p++,A=f[p]),b=y-_,N[D]=b}n.ptr=n.ptr+(p+1)*4+(m>0?4:0),n.pixels.resultPixels=M,a>1&&!i&&(n.pixels.resultPixels=t.swapDimensionOrder(M,c,a,r))},decodeBits:function(t,n,r,i,a){var o=n.headerInfo,s=o.fileVersion,c=0,l=t.byteLength-n.ptr>=5?5:t.byteLength-n.ptr,u=new DataView(t,n.ptr,l),d=u.getUint8(0);c++;var f=d>>6,p=f===0?4:3-f,m=(d&32)>0,h=d&31,g=0;if(p===1)g=u.getUint8(c),c++;else if(p===2)g=u.getUint16(c,!0),c+=2;else if(p===4)g=u.getUint32(c,!0),c+=4;else throw`Invalid valid pixel count type`;var _=2*o.maxZError,v,y,b,x,S,C,w,T,E,D=o.numDims>1?o.maxValues[a]:o.zMax;if(m){for(n.counter.lut++,T=u.getUint8(c),c++,x=Math.ceil((T-1)*h/8),S=Math.ceil(x/4),y=/* @__PURE__ */ new ArrayBuffer(S*4),b=new Uint8Array(y),n.ptr+=c,b.set(new Uint8Array(t,n.ptr,x)),w=new Uint32Array(y),n.ptr+=x,E=0;T-1>>>E;)E++;x=Math.ceil(g*E/8),S=Math.ceil(x/4),y=/* @__PURE__ */ new ArrayBuffer(S*4),b=new Uint8Array(y),b.set(new Uint8Array(t,n.ptr,x)),v=new Uint32Array(y),n.ptr+=x,C=s>=3?e.unstuffLUT2(w,h,T-1,i,_,D):e.unstuffLUT(w,h,T-1,i,_,D),s>=3?e.unstuff2(v,r,E,g,C):e.unstuff(v,r,E,g,C)}else n.counter.bitstuffer++,E=h,n.ptr+=c,E>0&&(x=Math.ceil(g*E/8),S=Math.ceil(x/4),y=/* @__PURE__ */ new ArrayBuffer(S*4),b=new Uint8Array(y),b.set(new Uint8Array(t,n.ptr,x)),v=new Uint32Array(y),n.ptr+=x,s>=3?i==null?e.originalUnstuff2(v,r,E,g):e.unstuff2(v,r,E,g,!1,i,_,D):i==null?e.originalUnstuff(v,r,E,g):e.unstuff(v,r,E,g,!1,i,_,D))},readTiles:function(e,n,r,i){var a=n.headerInfo,o=a.width,s=a.height,c=o*s,l=a.microBlockSize,u=a.imageType,d=t.getDataTypeSize(u),f=Math.ceil(o/l),p=Math.ceil(s/l);n.pixels.numBlocksY=p,n.pixels.numBlocksX=f,n.pixels.ptr=0;var m=0,h=0,g=0,_=0,v=0,y=0,b=0,x=0,S=0,C=0,w=0,T=0,E=0,D=0,O=0,k=0,A,j,M,N,P,F,I=new r(l*l),L=s%l||l,R=o%l||l,z,B,V=a.numDims,H,U=n.pixels.resultMask,W=n.pixels.resultPixels,G=a.fileVersion>=5?14:15,K,q=a.zMax,J;for(g=0;g<p;g++)for(v=g===p-1?L:l,_=0;_<f;_++)for(y=_===f-1?R:l,w=g*o*l+_*l,T=o-y,H=0;H<V;H++){if(V>1?(J=W,w=g*o*l+_*l,W=new r(n.pixels.resultPixels.buffer,c*H*d,c),q=a.maxValues[H]):J=null,b=e.byteLength-n.ptr,A=new DataView(e,n.ptr,Math.min(10,b)),j={},k=0,x=A.getUint8(0),k++,K=a.fileVersion>=5?x&4:0,S=x>>6&255,C=x>>2&G,C!==(_*l>>3&G)||K&&H===0)throw`integrity issue`;if(F=x&3,F>3)throw n.ptr+=k,`Invalid block encoding (`+F+`)`;if(F===2){if(K){if(U)for(m=0;m<v;m++)for(h=0;h<y;h++)U[w]&&(W[w]=J[w]),w++;else for(m=0;m<v;m++)for(h=0;h<y;h++)W[w]=J[w],w++}n.counter.constant++,n.ptr+=k;continue}if(F===0){if(K)throw`integrity issue`;if(n.counter.uncompressed++,n.ptr+=k,E=v*y*d,D=e.byteLength-n.ptr,E=E<D?E:D,M=new ArrayBuffer(E%d===0?E:E+d-E%d),N=new Uint8Array(M),N.set(new Uint8Array(e,n.ptr,E)),P=new r(M),O=0,U)for(m=0;m<v;m++){for(h=0;h<y;h++)U[w]&&(W[w]=P[O++]),w++;w+=T}else for(m=0;m<v;m++){for(h=0;h<y;h++)W[w++]=P[O++];w+=T}n.ptr+=O*d}else if(z=t.getDataTypeUsed(K&&u<6?4:u,S),B=t.getOnePixel(j,k,z,A),k+=t.getDataTypeSize(z),F===3){if(n.ptr+=k,n.counter.constantoffset++,U)for(m=0;m<v;m++){for(h=0;h<y;h++)U[w]&&(W[w]=K?Math.min(q,J[w]+B):B),w++;w+=T}else for(m=0;m<v;m++){for(h=0;h<y;h++)W[w]=K?Math.min(q,J[w]+B):B,w++;w+=T}}else if(n.ptr+=k,t.decodeBits(e,n,I,B,H),k=0,K){if(U)for(m=0;m<v;m++){for(h=0;h<y;h++)U[w]&&(W[w]=I[k++]+J[w]),w++;w+=T}else for(m=0;m<v;m++){for(h=0;h<y;h++)W[w]=I[k++]+J[w],w++;w+=T}}else if(U)for(m=0;m<v;m++){for(h=0;h<y;h++)U[w]&&(W[w]=I[k++]),w++;w+=T}else for(m=0;m<v;m++){for(h=0;h<y;h++)W[w++]=I[k++];w+=T}}V>1&&!i&&(n.pixels.resultPixels=t.swapDimensionOrder(n.pixels.resultPixels,c,V,r))},formatFileInfo:function(e){return{fileIdentifierString:e.headerInfo.fileIdentifierString,fileVersion:e.headerInfo.fileVersion,imageType:e.headerInfo.imageType,height:e.headerInfo.height,width:e.headerInfo.width,numValidPixel:e.headerInfo.numValidPixel,microBlockSize:e.headerInfo.microBlockSize,blobSize:e.headerInfo.blobSize,maxZError:e.headerInfo.maxZError,pixelType:t.getPixelType(e.headerInfo.imageType),eofOffset:e.eofOffset,mask:e.mask?{numBytes:e.mask.numBytes}:null,pixels:{numBlocksX:e.pixels.numBlocksX,numBlocksY:e.pixels.numBlocksY,maxValue:e.headerInfo.zMax,minValue:e.headerInfo.zMin,noDataValue:e.noDataValue}}},constructConstantSurface:function(e,t){var n=e.headerInfo.zMax,r=e.headerInfo.zMin,i=e.headerInfo.maxValues,a=e.headerInfo.numDims,o=e.headerInfo.height*e.headerInfo.width,s=0,c=0,l=0,u=e.pixels.resultMask,d=e.pixels.resultPixels;if(u){if(a>1){if(t)for(s=0;s<a;s++)for(l=s*o,n=i[s],c=0;c<o;c++)u[c]&&(d[l+c]=n);else for(c=0;c<o;c++)if(u[c])for(l=c*a,s=0;s<a;s++)d[l+a]=i[s]}else for(c=0;c<o;c++)u[c]&&(d[c]=n)}else if(a>1&&r!==n){if(t)for(s=0;s<a;s++)for(l=s*o,n=i[s],c=0;c<o;c++)d[l+c]=n;else for(c=0;c<o;c++)for(l=c*a,s=0;s<a;s++)d[l+s]=i[s]}else for(c=0;c<o*a;c++)d[c]=n},getDataTypeArray:function(e){var t;switch(e){case 0:t=Int8Array;break;case 1:t=Uint8Array;break;case 2:t=Int16Array;break;case 3:t=Uint16Array;break;case 4:t=Int32Array;break;case 5:t=Uint32Array;break;case 6:t=Float32Array;break;case 7:t=Float64Array;break;default:t=Float32Array}return t},getPixelType:function(e){var t;switch(e){case 0:t=`S8`;break;case 1:t=`U8`;break;case 2:t=`S16`;break;case 3:t=`U16`;break;case 4:t=`S32`;break;case 5:t=`U32`;break;case 6:t=`F32`;break;case 7:t=`F64`;break;default:t=`F32`}return t},isValidPixelValue:function(e,t){if(t==null)return!1;var n;switch(e){case 0:n=t>=-128&&t<=127;break;case 1:n=t>=0&&t<=255;break;case 2:n=t>=-32768&&t<=32767;break;case 3:n=t>=0&&t<=65536;break;case 4:n=t>=-2147483648&&t<=2147483647;break;case 5:n=t>=0&&t<=4294967296;break;case 6:n=t>=-34027999387901484e22&&t<=34027999387901484e22;break;case 7:n=t>=-17976931348623157e292&&t<=17976931348623157e292;break;default:n=!1}return n},getDataTypeSize:function(e){var t=0;switch(e){case 0:case 1:t=1;break;case 2:case 3:t=2;break;case 4:case 5:case 6:t=4;break;case 7:t=8;break;default:t=e}return t},getDataTypeUsed:function(e,t){var n=e;switch(e){case 2:case 4:n=e-t;break;case 3:case 5:n=e-2*t;break;case 6:n=t===0?e:t===1?2:1;break;case 7:n=t===0?e:e-2*t+1;break;default:n=e}return n},getOnePixel:function(e,t,n,r){var i=0;switch(n){case 0:i=r.getInt8(t);break;case 1:i=r.getUint8(t);break;case 2:i=r.getInt16(t,!0);break;case 3:i=r.getUint16(t,!0);break;case 4:i=r.getInt32(t,!0);break;case 5:i=r.getUInt32(t,!0);break;case 6:i=r.getFloat32(t,!0);break;case 7:i=r.getFloat64(t,!0);break;default:throw`the decoder does not understand this pixel type`}return i},swapDimensionOrder:function(e,t,n,r,i){var a=0,o=0,s=0,c=0,l=e;if(n>1){if(l=new r(t*n),i)for(a=0;a<t;a++)for(c=a,s=0;s<n;s++,c+=t)l[c]=e[o++];else for(a=0;a<t;a++)for(c=a,s=0;s<n;s++,c+=t)l[o++]=e[c]}return l}},n=function(e,t,n){this.val=e,this.left=t,this.right=n};return{decode:function(e,n){n=n||{};var r=n.noDataValue,i=0,a={};if(a.ptr=n.inputOffset||0,a.pixels={},t.readHeaderInfo(e,a)){var o=a.headerInfo,s=o.fileVersion,c=t.getDataTypeArray(o.imageType);if(s>5)throw`unsupported lerc version 2.`+s;t.readMask(e,a),o.numValidPixel!==o.width*o.height&&!a.pixels.resultMask&&(a.pixels.resultMask=n.maskData);var l=o.width*o.height;a.pixels.resultPixels=new c(l*o.numDims),a.counter={onesweep:0,uncompressed:0,lut:0,bitstuffer:0,constant:0,constantoffset:0};var u=!n.returnPixelInterleavedDims;if(o.numValidPixel!==0){if(o.zMax===o.zMin)t.constructConstantSurface(a,u);else if(s>=4&&t.checkMinMaxRanges(e,a))t.constructConstantSurface(a,u);else{var d=new DataView(e,a.ptr,2),f=d.getUint8(0);if(a.ptr++,f)t.readDataOneSweep(e,a,c,u);else if(s>1&&o.imageType<=1&&Math.abs(o.maxZError-.5)<1e-5){var p=d.getUint8(1);if(a.ptr++,a.encodeMode=p,p>2||s<4&&p>1)throw`Invalid Huffman flag `+p;p?t.readHuffman(e,a,c,u):t.readTiles(e,a,c,u)}else t.readTiles(e,a,c,u)}}a.eofOffset=a.ptr;var m;n.inputOffset?(m=a.headerInfo.blobSize+n.inputOffset-a.ptr,Math.abs(m)>=1&&(a.eofOffset=n.inputOffset+a.headerInfo.blobSize)):(m=a.headerInfo.blobSize-a.ptr,Math.abs(m)>=1&&(a.eofOffset=a.headerInfo.blobSize));var h={width:o.width,height:o.height,pixelData:a.pixels.resultPixels,minValue:o.zMin,maxValue:o.zMax,validPixelCount:o.numValidPixel,dimCount:o.numDims,dimStats:{minValues:o.minValues,maxValues:o.maxValues},maskData:a.pixels.resultMask};if(a.pixels.resultMask&&t.isValidPixelValue(o.imageType,r)){var g=a.pixels.resultMask;for(i=0;i<l;i++)g[i]||(h.pixelData[i]=r);h.noDataValue=r}return a.noDataValue=r,n.returnFileInfo&&(h.fileInfo=t.formatFileInfo(a)),h}},getBandCount:function(e){var n=0,r=0,i={};for(i.ptr=0,i.pixels={};r<e.byteLength-58;)t.readHeaderInfo(e,i),r+=i.headerInfo.blobSize,n++,i.ptr=r;return n}}})();var l=(function(){var e=/* @__PURE__ */ new ArrayBuffer(4),t=new Uint8Array(e),n=new Uint32Array(e);return n[0]=1,t[0]===1})(),u={decode:function(e,t){if(!l)throw`Big endian system is not supported.`;t=t||{};var n=t.inputOffset||0,r=new Uint8Array(e,n,10),i=String.fromCharCode.apply(null,r),a,o;if(i.trim()===`CntZImage`)a=s,o=1;else if(i.substring(0,5)===`Lerc2`)a=c,o=2;else throw`Unexpected file identifier string: `+i;for(var u=0,d=e.byteLength-10,f,p=[],m,h,g={width:0,height:0,pixels:[],pixelType:t.pixelType,mask:null,statistics:[]},_=0;n<d;){var v=a.decode(e,{inputOffset:n,encodedMaskData:f,maskData:h,returnMask:u===0,returnEncodedMask:u===0,returnFileInfo:!0,returnPixelInterleavedDims:t.returnPixelInterleavedDims,pixelType:t.pixelType||null,noDataValue:t.noDataValue||null});n=v.fileInfo.eofOffset,h=v.maskData,u===0&&(f=v.encodedMaskData,g.width=v.width,g.height=v.height,g.dimCount=v.dimCount||1,g.pixelType=v.pixelType||v.fileInfo.pixelType,g.mask=h),o>1&&(h&&p.push(h),v.fileInfo.mask&&v.fileInfo.mask.numBytes>0&&_++),u++,g.pixels.push(v.pixelData),g.statistics.push({minValue:v.minValue,maxValue:v.maxValue,noDataValue:v.noDataValue,dimStats:v.dimStats})}var y,b,x;if(o>1&&_>1){for(x=g.width*g.height,g.bandMasks=p,h=new Uint8Array(x),h.set(p[0]),y=1;y<p.length;y++)for(m=p[y],b=0;b<x;b++)h[b]=h[b]&m[b];g.maskData=h}return g}};let d={0:7e3,1:6e3,2:5e3,3:4e3,4:3e3,5:2500,6:2e3,7:1500,8:800,9:500,10:200,11:100,12:40,13:12,14:5,15:2,16:1,17:.5,18:.2,19:.1,20:.01};function f(e){let{height:t,width:n,pixels:r}=u.decode(e),i=new Float32Array(t*n);for(let e=0;e<i.length;e++)i[e]=r[0][e];return{array:i,width:n,height:t}}function p(e,t,n){let r=f(e);n[2]-n[0]<1&&(r=m(r,n));let{array:i,width:o}=r,s=new a(o).createTile(i),c=d[t]||0;return s.getGeometryData(c)}function m(e,t){function n(e,t,n,r,i,a,o,s){let c=new Float32Array(i*a);for(let o=0;o<a;o++)for(let a=0;a<i;a++){let s=(o+r)*t+(a+n),l=o*i+a;c[l]=e[s]}let l=new Float32Array(s*o);for(let e=0;e<s;e++)for(let t=0;t<o;t++){let n=e*s+t,r=Math.round(t*a/s);l[n]=c[Math.round(e*i/o)*i+r]}return l}let r=h(t,e.width),i=r.sw+1,a=r.sh+1;return{array:n(e.array,e.width,r.sx,r.sy,r.sw,r.sh,i,a),width:i,height:a}}function h(e,t){return{sx:Math.floor(e[0]*t),sy:Math.floor(e[1]*t),sw:Math.floor((e[2]-e[0])*t),sh:Math.floor((e[3]-e[1])*t)}}self.onmessage=e=>{let t=e.data,n=p(t.demData,t.z,t.clipBounds);self.postMessage(n)}})();", Ve = typeof self < "u" && self.Blob && new Blob(["(self.URL || self.webkitURL).revokeObjectURL(self.location.href);", Be], { type: "text/javascript;charset=utf-8" });
function He(e) {
	let t;
	try {
		if (t = Ve && (self.URL || self.webkitURL).createObjectURL(Ve), !t) throw "";
		let n = new Worker(t, { name: e?.name });
		return n.addEventListener("error", () => {
			(self.URL || self.webkitURL).revokeObjectURL(t);
		}), n;
	} catch {
		return new Worker("data:text/javascript;charset=utf-8," + encodeURIComponent(Be), { name: e?.name });
	}
}
//#endregion
//#region src/loader/terrainLercLoader/TileGeometryLercLoader.ts
var Ue = 5;
//#endregion
//#region src/loader/terrainLercLoader/index.ts
$(new class extends J {
	constructor() {
		super(), M(this, "info", {
			version: A,
			description: "Tile LERC terrain loader. It can load ArcGis-lerc format terrain data."
		}), M(this, "dataType", "lerc"), M(this, "fileLoader", new s(W.manager)), M(this, "_workerPool", new oe(0)), this.fileLoader.setResponseType("arraybuffer"), this._workerPool.setWorkerCreator(() => new He());
	}
	async doLoad(e, t) {
		this._workerPool.pool === 0 && this._workerPool.setWorkerLimit(Ue);
		let { z: n, clipBounds: r } = t, i = {
			demData: await this.fileLoader.loadAsync(e),
			z: n,
			clipBounds: r
		}, a = (await this._workerPool.postMessage(i)).data;
		return new U().setData(a);
	}
}());
//#endregion
//#region src/loader/terrainRGBLoader/parse.worker.ts?worker&inline
var We = "(function(){function e(e){return t(e.data)}function t(e){function t(e,t){let n=t*4,[r,i,a,o]=e.slice(n,n+4);return o===0?0:-1e4+(r<<16|i<<8|a)*.1}let n=e.length>>>2,r=new Float32Array(n);for(let i=0;i<n;i++)r[i]=t(e,i);return r}self.onmessage=t=>{let n=e(t.data.imgData);self.postMessage(n)}})();", Ge = typeof self < "u" && self.Blob && new Blob(["(self.URL || self.webkitURL).revokeObjectURL(self.location.href);", We], { type: "text/javascript;charset=utf-8" });
function Ke(e) {
	let t;
	try {
		if (t = Ge && (self.URL || self.webkitURL).createObjectURL(Ge), !t) throw "";
		let n = new Worker(t, { name: e?.name });
		return n.addEventListener("error", () => {
			(self.URL || self.webkitURL).revokeObjectURL(t);
		}), n;
	} catch {
		return new Worker("data:text/javascript;charset=utf-8," + encodeURIComponent(We), { name: e?.name });
	}
}
//#endregion
//#region src/loader/terrainRGBLoader/TerrainRGBLoader.ts
var qe = 10, Je = class extends J {
	constructor() {
		super(), M(this, "info", {
			version: A,
			description: "Mapbox-RGB terrain loader, It can load Mapbox-RGB terrain data."
		}), M(this, "dataType", "terrain-rgb"), M(this, "imageLoader", new u(W.manager)), M(this, "_workerPool", new oe(0)), this._workerPool.setWorkerCreator(() => new Ke());
	}
	async doLoad(e, t) {
		let n = await this.imageLoader.loadAsync(e), { clipBounds: r, z: i } = t, a = Ye(n, r, p.clamp((i + 2) * 3, 2, 64)), o;
		this._workerPool.pool === 0 && this._workerPool.setWorkerLimit(qe), o = (await this._workerPool.postMessage({ imgData: a }, [a.data.buffer])).data;
		let s = new U();
		return s.setData(o), s;
	}
};
function Ye(e, t, n) {
	let r = G(t, e.width);
	n = Math.min(n, r.sw);
	let i = new OffscreenCanvas(n, n).getContext("2d");
	return i.imageSmoothingEnabled = !1, i.drawImage(e, r.sx, r.sy, r.sw, r.sh, 0, 0, n, n), i.getImageData(0, 0, n, n);
}
//#endregion
//#region src/loader/terrainRGBLoader/index.ts
$(new Je());
//#endregion
//#region src/loader/terrariumShaderLoader/TerrariumShaderLoader.ts
var Xe = class extends J {
	constructor(...e) {
		super(...e), M(this, "info", {
			version: A,
			description: "Terrarium shader loader — uploads raw PNG for GPU decode via TSL positionNode."
		}), M(this, "dataType", "terrarium-shader"), M(this, "imageLoader", new u(W.manager));
	}
	async doLoad(e, t) {
		let n = await this.imageLoader.loadAsync(e), { clipBounds: r, z: i } = t, a = Math.min(Math.max((i + 2) * 4, 16), 128), o = G(r, n.width), s = new OffscreenCanvas(a, a), c = s.getContext("2d");
		c.imageSmoothingEnabled = !1, c.drawImage(n, o.sx, o.sy, o.sw, o.sh, 0, 0, a, a);
		let l = new S(s);
		l.colorSpace = "", l.generateMipmaps = !1, l.magFilter = d, l.minFilter = d, l.needsUpdate = !0;
		let u = Ze(a);
		return u.userData.heightTexture = l, u;
	}
};
function Ze(e) {
	let t = new Float32Array(e * e), n = new U();
	return n.setData(t, 1e3), n;
}
//#endregion
//#region src/loader/terrariumShaderLoader/index.ts
$(new Xe());
//#endregion
//#region src/loader/debugCanvasLoader/DebugCanvasLoader.ts
var Qe = [
	"#ff6666",
	"#66ff66",
	"#6666ff",
	"#ffff66",
	"#ff66ff",
	"#66ffff",
	"#ff9933",
	"#9933ff",
	"#33ff99",
	"#ff3399",
	"#3399ff",
	"#99ff33",
	"#cc6600",
	"#0066cc",
	"#66cc00",
	"#cc0066",
	"#00cc66",
	"#6600cc",
	"#ff4444",
	"#44ff44"
], $e = class extends Re {
	constructor(...e) {
		super(...e), M(this, "dataType", "debug");
	}
	drawTile(e, t) {
		let { x: n, y: r, z: i } = t, a = e.canvas.width, o = e.canvas.height;
		e.fillStyle = Qe[i % Qe.length], e.globalAlpha = .4, e.fillRect(0, 0, a, o), e.globalAlpha = 1, e.strokeStyle = "#000", e.lineWidth = 2, e.strokeRect(1, 1, a - 2, o - 2), e.fillStyle = "#000", e.font = "bold 28px monospace", e.textAlign = "center", e.textBaseline = "middle", e.fillText(`Z${i}`, a / 2, o / 2 - 30), e.fillText(`X${n}  Y${r}`, a / 2, o / 2 + 10), e.strokeStyle = "rgba(0,0,0,0.3)", e.lineWidth = 1, e.beginPath(), e.moveTo(a / 2, 0), e.lineTo(a / 2, o), e.moveTo(0, o / 2), e.lineTo(a, o / 2), e.stroke();
	}
};
//#endregion
//#region src/loader/debugCanvasLoader/index.ts
pt(new $e());
//#endregion
//#region src/source/TileSource.ts
var et = class e {
	constructor(e) {
		M(this, "dataType", "image"), M(this, "attribution", "ThreeTile"), M(this, "minLevel", 0), M(this, "maxLevel", 18), M(this, "projectionID", "3857"), M(this, "url", ""), M(this, "subdomains", []), M(this, "opacity", 1), M(this, "transparent", !0), M(this, "isTMS", !1), M(this, "bounds", void 0), M(this, "_projectionBounds", [
			-Infinity,
			-Infinity,
			Infinity,
			Infinity
		]), Object.assign(this, e);
	}
	_getBBox(e, t, n) {
		let r = Math.PI * 6378137, i = 2 * r / 2 ** n;
		return `${-r + e * i},${r - (t + 1) * i},${-r + (e + 1) * i},${r - t * i}`;
	}
	getUrl(e, t, n, r) {
		let i = this.subdomains.length, a;
		if (i > 0) {
			let e = Math.floor(Math.random() * i);
			a = this.subdomains[e];
		}
		let o = this._getBBox(e, t, n);
		t = this.isTMS ? 2 ** n - 1 - t : t;
		let s = {
			...this,
			x: e,
			y: t,
			z: n,
			s: a,
			bbox: o,
			...r
		};
		return tt(this.url, s);
	}
	static create(t) {
		return new e(t);
	}
};
function tt(e, t) {
	return e.replace(/\{ *([\w_-]+) *\}/g, (e, n) => {
		let r = t[n] ?? (() => {
			throw Error(`source url template error, No value provided for variable: ${e}`);
		})();
		return typeof r == "function" ? r(t) : r;
	});
}
//#endregion
//#region src/map/projection/BaseProjection.ts
var nt = class {
	get lon0() {
		return this._lon0;
	}
	constructor(e = 0) {
		M(this, "_lon0", 0), this._lon0 = e;
	}
	getTileXWithCenterLon(e, t) {
		let n = 2 ** t, r = e + Math.round(n / 360 * this._lon0);
		return r >= n ? r -= n : r < 0 && (r += n), r;
	}
	getProjBoundsFromLonLat(e) {
		let t = e[2] - e[0] > 180, n = this.project(e[0] + (t ? this._lon0 : 0), e[1]), r = this.project(e[2] + (t ? this._lon0 : 0), e[3]);
		return [
			Math.min(n.x, r.x),
			Math.min(n.y, r.y),
			Math.max(n.x, r.x),
			Math.max(n.y, r.y)
		];
	}
	getProjBoundsFromXYZ(e, t, n) {
		let r = Math.PI * 6378137, i = 2 * r / 2 ** n;
		return [
			-r + e * i,
			r - (t + 1) * i,
			-r + (e + 1) * i,
			r - t * i
		];
	}
	getLonLatBoundsFromXYZ(e, t, n) {
		let r = this.getProjBoundsFromXYZ(e, t, n), i = this.unProject(r[0], r[1]), a = this.unProject(r[2], r[3]);
		return [
			i.lon,
			i.lat,
			a.lon,
			a.lat
		];
	}
}, Y = 6378137, rt = class extends nt {
	constructor(...e) {
		super(...e), M(this, "ID", "3857"), M(this, "mapWidth", 2 * Math.PI * Y), M(this, "mapHeight", this.mapWidth), M(this, "mapDepth", 1);
	}
	project(e, t) {
		let n = (e - this.lon0) * (Math.PI / 180), r = Math.PI / 180 * t;
		return {
			x: Y * n,
			y: Y * Math.log(Math.tan(Math.PI / 4 + r / 2))
		};
	}
	unProject(e, t) {
		let n = e / Y * (180 / Math.PI) + this.lon0;
		return n > 180 && (n -= 360), {
			lat: (2 * Math.atan(Math.exp(t / Y)) - Math.PI / 2) * (180 / Math.PI),
			lon: n
		};
	}
}, it = class extends nt {
	constructor(...e) {
		super(...e), M(this, "ID", "4326"), M(this, "mapWidth", 36e6), M(this, "mapHeight", 18e6), M(this, "mapDepth", 1);
	}
	project(e, t) {
		return {
			x: (e - this.lon0) * 100 * 1e3,
			y: t * 100 * 1e3
		};
	}
	unProject(e, t) {
		return {
			lon: e / 1e5 + this.lon0,
			lat: t / 1e5
		};
	}
}, at = { createFromID: (e = "3857", t) => {
	let n;
	switch (e) {
		case "3857":
			n = new rt(t);
			break;
		case "4326":
			n = new it(t);
			break;
		default: throw Error(`Projection ID: ${e} is not supported.`);
	}
	return n;
} }, ot = class extends q {
	constructor(...e) {
		super(...e), M(this, "_projection", new rt(0));
	}
	get imgSource() {
		return super.imgSource;
	}
	set imgSource(e) {
		super.imgSource = e, this._updateImgProjBounds();
	}
	get demSource() {
		return super.demSource;
	}
	set demSource(e) {
		super.demSource = e, this._updateDemPrjBounds();
	}
	_updateImgProjBounds() {
		let e = this._projection;
		this.imgSource.forEach((t) => {
			t._projectionBounds = e.getProjBoundsFromLonLat(t.bounds || this.bounds);
		});
	}
	_updateDemPrjBounds() {
		let e = this._projection;
		this.demSource && (this.demSource._projectionBounds = e.getProjBoundsFromLonLat(this.demSource.bounds || this.bounds));
	}
	get projection() {
		return this._projection;
	}
	set projection(e) {
		this._projection = e, this._updateImgProjBounds(), this._updateDemPrjBounds();
	}
	async load(e) {
		let { x: t, y: n, z: r, bounds: i, lonLatBounds: a } = this.getTileCoords(e);
		return super.load({
			x: t,
			y: n,
			z: r,
			bounds: i,
			lonLatBounds: a
		});
	}
	async update(e, t, n, r) {
		let { x: i, y: a, z: o, bounds: s, lonLatBounds: c } = this.getTileCoords(t);
		return await super.update(e, {
			x: i,
			y: a,
			z: o,
			bounds: s,
			lonLatBounds: c
		}, n, r);
	}
	getTileCoords(e) {
		if (!this._projection) throw Error("projection is undefined");
		let { x: t, y: n, z: r } = e;
		return {
			x: this._projection.getTileXWithCenterLon(t, r),
			y: n,
			z: r,
			bounds: this._projection.getProjBoundsFromXYZ(t, n, r),
			lonLatBounds: this._projection.getLonLatBoundsFromXYZ(t, n, r)
		};
	}
}, X = new b(), st = new w(0, -1, 0), ct = new w();
function Z(e, t) {
	let n = t.intersectObject(e.rootTile, !0);
	if (n.length > 0) {
		let t = n[0];
		console.assert(t.object.visible);
		let r = e.worldToLocal(t.point.clone()), i = e.map2geo(r);
		return Object.assign(t, { location: i });
	}
}
function Q(e, t) {
	return ct.set(t.x, 1e4, t.z), X.set(ct, st), Z(e, X);
}
function lt(e, t, n) {
	return X.setFromCamera(n, e), Z(t, X);
}
function ut(e) {
	let t = e.loader.manager, n = (t, n) => {
		e.dispatchEvent({
			type: t,
			...n
		});
	};
	t.onStart = (e, t, r) => {
		n("loading-start", {
			url: e,
			itemsLoaded: t,
			itemsTotal: r
		});
	}, t.onError = (e) => {
		n("loading-error", { url: e });
	}, t.onLoad = () => {
		n("loading-complete");
	}, t.onProgress = (e, t, r) => {
		n("loading-progress", {
			url: e,
			itemsLoaded: t,
			itemsTotal: r
		});
	}, t.onParseEnd = (e) => {
		n("parsing-end", { geometry: e });
	}, e.rootTile.addEventListener("tile-created", (e) => {
		n("tile-created", { tile: e.tile });
	}), e.rootTile.addEventListener("tile-loaded", (e) => {
		n("tile-loaded", { tile: e.tile });
	}), e.rootTile.addEventListener("tile-unload", (e) => {
		n("tile-unload", { tile: e.tile });
	}), e.rootTile.addEventListener("tile-visible-changed", (e) => {
		n("tile-visible-changed", { tile: e.tile });
	});
}
//#endregion
//#region src/map/TileMap.ts
var dt = class e extends y {
	get minLevel() {
		return this._minLevel;
	}
	set minLevel(e) {
		this._minLevel = e;
	}
	get maxLevel() {
		return this._maxLevel;
	}
	set maxLevel(e) {
		this._maxLevel = e;
	}
	get lon0() {
		return this.projection.lon0;
	}
	set lon0(e) {
		this.projection.lon0 !== e && (e != 0 && this.minLevel < 1 && console.warn(`Map centralMeridian is ${this.lon0}, minLevel must > 0`), this.projection = at.createFromID(this.projection.ID, e), this.updateSource());
	}
	get projection() {
		return this.loader.projection;
	}
	set projection(e) {
		(e.ID != this.projection.ID || e.lon0 != this.lon0) && (this.loader.projection = e, this._resize(), this.reload(), this.debug > 0 && console.log("Map Projection Changed:", e.ID, e.lon0), this.dispatchEvent({
			type: "projection-changed",
			projection: e
		}));
	}
	get imgSource() {
		return this.loader.imgSource;
	}
	set imgSource(e) {
		let t = Array.isArray(e) ? e : [e];
		if (t.length === 0) throw Error("imgSource can not be empty");
		this.projection = at.createFromID(t[0].projectionID, this.projection.lon0), this.loader.imgSource = t, this.updateSource(!0, !1), this.debug > 0 && console.log("Img Source Changed:", t), this.dispatchEvent({
			type: "source-changed",
			source: e
		});
	}
	get demSource() {
		return this.loader.demSource;
	}
	set demSource(e) {
		this.loader.demSource = e, this.updateSource(!1, !0), this.debug > 0 && console.log("DEM Source Changed:", this.demSource), this.dispatchEvent({
			type: "source-changed",
			source: e
		});
	}
	get LODThreshold() {
		return this._LODThreshold;
	}
	set LODThreshold(e) {
		this._LODThreshold = e;
	}
	get backgroundColor() {
		return this.loader.backgroundMaterial.color;
	}
	set backgroundColor(e) {
		this.loader.backgroundMaterial.color.set(e);
	}
	get bounds() {
		return this.loader.bounds;
	}
	set bounds(e) {
		this.loader.bounds = e;
	}
	static create(t) {
		return new e(t);
	}
	constructor(e) {
		super(), M(this, "name", "map"), M(this, "_mapClock", new o()), M(this, "isLOD", !0), M(this, "autoUpdate", !0), M(this, "debug", 0), M(this, "updateInterval", 100), M(this, "rootTile", void 0), M(this, "loader", void 0), M(this, "_minLevel", 2), M(this, "_maxLevel", 19), M(this, "_LODThreshold", 1), this.up.set(0, 0, 1);
		let { loader: t = new ot(), rootTile: n = new I(), minLevel: r = 2, maxLevel: i = 20, imgSource: a, demSource: s, backgroundColor: c, bounds: l, lon0: u = 0, debug: d = 0 } = e;
		this._minLevel = r, this._maxLevel = i, this.loader = t, this.rootTile = n, c && this.loader.backgroundMaterial.color.set(c), l && (this.loader.bounds = l), this.debug = this.loader.debug = d, this.lon0 = u, this.imgSource = Array.isArray(a) ? a : [a], this.demSource = s, this.add(n), this._resize(), ut(this);
		let f = () => {
			this.dispatchEvent({ type: "ready" }), this.removeEventListener("loading-complete", f);
		};
		this.addEventListener("loading-complete", f);
	}
	_resize() {
		this.rootTile.scale.set(this.projection.mapWidth, this.projection.mapHeight, this.projection.mapDepth), this.rootTile.updateMatrix(), this.rootTile.updateMatrixWorld();
	}
	update(e) {
		let t = this._mapClock.getElapsedTime();
		t > this.updateInterval / 1e3 && (this.rootTile.update({
			camera: e,
			loader: this.loader,
			minLevel: this.minLevel,
			maxLevel: this.maxLevel,
			LODThreshold: this.LODThreshold
		}), this.rootTile.castShadow = this.castShadow, this.rootTile.receiveShadow = this.receiveShadow, this.dispatchEvent({
			type: "update",
			delta: t
		}), this._mapClock.start());
	}
	updateSource(e = !0, t = !0) {
		this.rootTile.updateData(e, t);
	}
	reload() {
		this.rootTile.reload(this.loader);
	}
	dispose() {
		this.removeFromParent(), this.reload();
	}
	geo2pos(e) {
		return this.geo2map(e);
	}
	geo2map(e) {
		let t = this.projection.project(e.x, e.y);
		return new w(t.x, t.y, e.z);
	}
	geo2world(e) {
		return this.localToWorld(this.geo2map(e));
	}
	pos2geo(e) {
		return this.map2geo(e);
	}
	map2geo(e) {
		let t = this.projection.unProject(e.x, e.y);
		return new w(t.lon, t.lat, e.z);
	}
	world2geo(e) {
		return this.pos2geo(this.worldToLocal(e.clone()));
	}
	getLocalInfoFromGeo(e) {
		let t = this.geo2world(e);
		return Q(this, t);
	}
	getLocalInfoFromWorld(e) {
		return Q(this, e);
	}
	getLocalInfoFromScreen(e, t) {
		return lt(e, this, t);
	}
	get downloading() {
		return this.loader.downloadingThreads;
	}
	getTileCount() {
		let e = 0, t = 0, n = 0, r = 0, i = 0, a = 0;
		return this.rootTile.traverse((o) => {
			o instanceof I && (e++, o.isLeaf && (i++, o.showing && t++, o.inFrustum && n++), r = Math.max(r, o.z), a = this.loader.downloadingThreads);
		}), {
			total: e,
			leaf: i,
			visible: t,
			inFrustum: n,
			maxLevel: r,
			downloading: a
		};
	}
};
//#endregion
//#region src/index.ts
function ft(e, t = 100) {
	return new Promise((n) => {
		let r = () => {
			e() ? n() : setTimeout(r, t);
		};
		r();
	});
}
function pt(e) {
	return W.registerMaterialLoader(e), e;
}
function $(e) {
	return W.registerGeometryLoader(e), e;
}
function mt(e) {
	return W.getMaterialLoader(e);
}
function ht(e) {
	return W.getGeometryLoader(e);
}
function gt() {
	return W.getLoaders();
}
//#endregion
export { $e as DebugCanvasLoader, W as LoaderFactory, ke as Martini, Ne as PromiseWorker, Xe as TerrariumShaderLoader, I as Tile, Re as TileCanvasLoader, U as TileGeometry, J as TileGeometryLoader, ze as TileImageLoader, q as TileLoader, je as TileLoadingManager, dt as TileMap, L as TileMaterial, Le as TileMaterialLoader, et as TileSource, z as VectorFeatureTypes, Se as VectorTileRender, Ce as addSkirt, xe as applyTerrariumElevation, ut as attachEvent, se as author, B as concatenateTypedArrays, R as decodeTerrariumTSL, G as getBoundsCoord, ht as getDEMLoader, De as getGeometryDataFromDem, V as getGridIndices, mt as getImgLoader, Z as getLocalInfoFromRay, lt as getLocalInfoFromScreen, Q as getLocalInfoFromWorld, H as getNormals, K as getSafeTileUrlAndBounds, Pe as getSubImage, gt as getTileLoaders, $ as registerDEMLoader, pt as registerImgLoader, tt as strTemplate, Ie as tileBoundsClip, A as version, ft as waitFor };
