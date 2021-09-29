## [4.0.1](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/compare/v4.0.0...v4.0.1) (2021-09-29)


### Bug Fixes

* **#421:** fix issue [#421](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/issues/421) - crash when getting name of MemberExpression ([777d047](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/commit/777d047e26f8a5ced9cad254267955985d3e2526))

# [4.0.0](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/compare/v3.0.1...v4.0.0) (2021-09-28)


### chore

* **ci:** add eslint to ci ([0cbbf6e](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/commit/0cbbf6effa764dca011ba6ccb1b33e8dabd128fb))


### BREAKING CHANGES

* **ci:** drop support for eslint@5

this technically isn't a breaking change, as eslint@5 likely never
worked. But now CI is testing supported versions of eslint.

## [3.0.1](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/compare/v3.0.0...v3.0.1) (2021-09-28)


### Bug Fixes

* **readme:** update readme to reflect new node support policy ([84ab1f1](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/commit/84ab1f1d38f64fe856e12765a1a82fe1f53f6739))

# [3.0.0](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/compare/v2.2.29...v3.0.0) (2021-09-28)


### chore

* drop support fore node 10 ([5130cc1](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/commit/5130cc127da3b27eb028ace01032b792668916ad))


### BREAKING CHANGES

* node < 12 is no longer supported.

Added node 14 and 16 to the test matrix

## [2.2.29](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/compare/v2.2.28...v2.2.29) (2021-07-20)


### Bug Fixes

* **313:** only count chars on first line of multi-line decorator value ([1a1bc21](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/commit/1a1bc218f06d32429aa63607497fcbbd569a6fc9))

## [2.2.28](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/compare/v2.2.27...v2.2.28) (2021-06-03)


### Bug Fixes

* **#337:** wrap require prettier in a try-catch so that we don't throw when dep tree has no prettier ([f7594ff](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/commit/f7594ff04a4da8e5f224162a71b749f738577561)), closes [#337](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/issues/337)

## [2.2.27](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/compare/v2.2.26...v2.2.27) (2021-05-27)


### Bug Fixes

* **deps:** move linter deps to peer deps ([a97d8ff](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/commit/a97d8fff481b24c1874325b603920adb43ab219f))

## [2.2.26](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/compare/v2.2.25...v2.2.26) (2021-05-22)


### Bug Fixes

* **deps:** update dependency eslint to ^7.27.0 ([8097d2d](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/commit/8097d2d61e9332fa4e0f4de043b14752496428f0))

## [2.2.25](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/compare/v2.2.24...v2.2.25) (2021-05-08)


### Bug Fixes

* **deps:** update dependency eslint to ^7.26.0 ([7dd7fb1](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/commit/7dd7fb1b7e98a2f60eaad957ca0297e40eb040f6))

## [2.2.24](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/compare/v2.2.23...v2.2.24) (2021-04-24)


### Bug Fixes

* **deps:** update dependency eslint to ^7.25.0 ([f7c2e62](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/commit/f7c2e62857d55515c26cbf937c67739ee101546c))

## [2.2.23](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/compare/v2.2.22...v2.2.23) (2021-04-10)


### Bug Fixes

* **deps:** update dependency eslint to ^7.24.0 ([a7baeea](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/commit/a7baeeaf99d70f0f632b2db4667e738780764fbe))

## [2.2.22](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/compare/v2.2.21...v2.2.22) (2021-03-27)


### Bug Fixes

* **deps:** update dependency eslint to ^7.23.0 ([d745a5a](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/commit/d745a5ac767259b65dfa8306ee8e59b566098a1e))

## [2.2.21](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/compare/v2.2.20...v2.2.21) (2021-03-23)


### Bug Fixes

* **deps:** update dependency eslint to ^7.22.0 ([9b75f98](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/commit/9b75f98561210d081cd8fa9338f6c735ba8e2f4b))

## [2.2.20](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/compare/v2.2.19...v2.2.20) (2021-03-22)


### Bug Fixes

* include indentation when counting line width ([b86643a](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/commit/b86643a358425e5e6bcf78497140b2c2d44004db))

## [2.2.19](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/compare/v2.2.18...v2.2.19) (2021-02-13)


### Bug Fixes

* **deps:** update dependency eslint to ^7.20.0 ([b16acc1](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/commit/b16acc1533d2ba46e3d2f63467b9907b3165019d))

## [2.2.18](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/compare/v2.2.17...v2.2.18) (2021-01-31)


### Bug Fixes

* **deps:** update dependency eslint to ^7.19.0 ([b744841](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/commit/b744841aae971125483dbad55feddcd2e846649b))

## [2.2.17](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/compare/v2.2.16...v2.2.17) (2021-01-16)


### Bug Fixes

* **deps:** update dependency eslint to ^7.18.0 ([24cf543](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/commit/24cf543ed26c119ebf9d747d50be8357c874fee3))

## [2.2.16](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/compare/v2.2.15...v2.2.16) (2021-01-02)


### Bug Fixes

* **deps:** update dependency eslint to ^7.17.0 ([76e5695](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/commit/76e5695e11d18333149dfb3ad6d87381088c7008))

## [2.2.15](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/compare/v2.2.14...v2.2.15) (2020-12-19)


### Bug Fixes

* **deps:** update dependency eslint to ^7.16.0 ([34b4172](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/commit/34b4172f85d1e0c36bad262bd1ffd36b8123ea3a))

## [2.2.14](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/compare/v2.2.13...v2.2.14) (2020-12-05)


### Bug Fixes

* **deps:** update dependency eslint to ^7.15.0 ([c174771](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/commit/c174771b8d7a2b4f527a663f440f761e5b14610a))

## [2.2.13](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/compare/v2.2.12...v2.2.13) (2020-11-23)


### Bug Fixes

* **#214:** update private prettier path ([a141e7a](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/commit/a141e7a109eea69dae6d11a949e3a635fbbd42eb)), closes [#214](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/issues/214)
* **internal:** ci was missing two smoke tests ([27080ce](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/commit/27080ce80bc062d836fee5142e7935bf3fff71fd))

## [2.2.12](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/compare/v2.2.11...v2.2.12) (2020-11-21)


### Bug Fixes

* **deps:** update dependency eslint to ^7.14.0 ([810e542](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/commit/810e542d0d7c3251d7e903e265bdc4e89fa3dfa1))

## [2.2.11](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/compare/v2.2.10...v2.2.11) (2020-11-09)


### Bug Fixes

* **typo:** warning flag should be false by default ([e019bf2](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/commit/e019bf2ccba5778fc78b7ae469dec2cc72a5ef73))

## [2.2.10](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/compare/v2.2.9...v2.2.10) (2020-11-09)


### Bug Fixes

* **#198:** fix issue [#198](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/issues/198) by only displaying warn once ([98a18a1](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/commit/98a18a13e154f3dd768688f5c9f6a0a1838df38a))

## [2.2.9](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/compare/v2.2.8...v2.2.9) (2020-11-09)


### Bug Fixes

* **#196:** fix prettier unspecified printWidth ([2c327c8](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/commit/2c327c87464152a86998baab26034305ff007a1a)), closes [#195](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/issues/195)

## [2.2.8](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/compare/v2.2.7...v2.2.8) (2020-11-09)


### Bug Fixes

* **#195:** decorators using declare now respect prettier ([607f4ba](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/commit/607f4bafed1a65a85ba540eca5ac525c1c03781c)), closes [#195](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/issues/195)

## [2.2.7](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/compare/v2.2.6...v2.2.7) (2020-11-08)


### Bug Fixes

* **deps:** update dependency eslint to ^7.13.0 ([4e3f25a](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/commit/4e3f25a6589deaa803f8326fdc4a9a774b3e005f))

## [2.2.6](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/compare/v2.2.5...v2.2.6) (2020-10-30)


### Bug Fixes

* **readme:** ESLint configuration key name matches rule name ([#189](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/issues/189)) ([7935c85](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/commit/7935c85c6b78123ee50b66550b68893740e5d13e))

## [2.2.5](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/compare/v2.2.4...v2.2.5) (2020-10-27)


### Bug Fixes

* **deps:** update dependency eslint to ^7.12.1 ([352b54d](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/commit/352b54dd3f9ceb58c83a94a59751318d4aa86dfc))

## [2.2.4](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/compare/v2.2.3...v2.2.4) (2020-10-24)


### Bug Fixes

* **deps:** update dependency eslint to ^7.12.0 ([110c64c](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/commit/110c64ce3b8bd80bfb1e3d04825f93c07194f49f))

## [2.2.3](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/compare/v2.2.2...v2.2.3) (2020-10-09)


### Bug Fixes

* **deps:** update dependency eslint to ^7.11.0 ([dfbba5c](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/commit/dfbba5cd0278e4dfbfc4bf822b2c0591a37d196c))

## [2.2.2](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/compare/v2.2.1...v2.2.2) (2020-10-03)


### Bug Fixes

* widen eslint version in package.json ([46fc297](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/commit/46fc297f40746018fd5de0b667849d71675c0d62))

## [2.2.1](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/compare/v2.2.0...v2.2.1) (2020-06-29)


### Bug Fixes

* **deps:** update dependency eslint to v7.3.1 ([3dd555c](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/commit/3dd555c5548efd7d24ab0f5d32a0dde261059886))

# [2.2.0](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/compare/v2.1.0...v2.2.0) (2020-06-29)


### Features

* support printWidth and optionally inherit from prettier config ([e3e621d](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/commit/e3e621d5aeda67931217cab874f16ebdf623d8ec))
* take alternate path when line length is greater than printWidth ([09c4440](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/commit/09c44403e55c05df138344f1d538516e258db7c2))

# [2.1.0](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/compare/v2.0.4...v2.1.0) (2020-05-23)


### Bug Fixes

* backfill changelog ([c3ea94f](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/commit/c3ea94fd0b50f27fe53fe8d31866cd36e666797b))


### Features

* **internal:** support changelog generation ([e89171c](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/commit/e89171c3fc5448e8bc4210acba601b1a35688721))

## [1.0.3](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/compare/v2.0.4...v1.0.3) (2020-05-23)


### Bug Fixes

* **internal:** resolve bad lint rule ([706076e](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/commit/706076e93ee20e06c170f1d6612cc9acd8e6eba4))
* **tests:** ember smoke test by upgrading eslint ([e82992c](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/commit/e82992c268ca817d78f81e74271c0618cfe281ef))
* **tests:** prettier smoke test had invalid eslint config ([67eccfd](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/commit/67eccfdf0206e488a569189c914f5dc94721e2d2))
* **tests:** re-fix tests due to imlint ([82ae9c1](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/commit/82ae9c110097825fe7f627ba2607062b1ebec5f6))


### Features

* **internal:** support changelog generation ([e89171c](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/commit/e89171c3fc5448e8bc4210acba601b1a35688721))



## [2.0.3](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/compare/v2.0.2...v2.0.3) (2020-04-21)


### Bug Fixes

* **config:** normalizeConfig broke ([8988541](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/commit/8988541b62f3de74464da019208237d9d61bea7e))
* **deps:** add babel-eslint to smoke tests ([ce8eafe](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/commit/ce8eafea6e1b6e8bf12d519f49effbc9322f1693))
* **docs:** custom rule ([#33](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/issues/33)) ([724551d](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/commit/724551d49a059908bbe3d245a9f338c4b20ec11e))
* **readme:** shorten readme example ([b8e5b2d](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/commit/b8e5b2d7ee8e08375418dec268a4ff8d2f130abc))
* **readme:** shorten readme example ([540a1c5](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/commit/540a1c5937253087fe5dd2692deb2b636a567f25))
* **readme:** update example eslintrc ([b3bb8c0](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/commit/b3bb8c096df8fdc4ab8b0df64bc6c35cc3bfce3d))
* **rule:** ignore same-line multi-line decorators ([7c34aac](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/commit/7c34aacf969ecaf0c608c7a6bfc9de751e3641f9))
* **test:** fail the smoke test if anything fails ([59073cd](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/commit/59073cd18d27131f2389b4c15a765b6db0c3f646))
* **tests:** smoke-test script needs to install main deps first ([25589a0](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/commit/25589a032ae2068fa643c8b8c303f241c590332c))


### chore

* change the defaults to be more ergonomic ([fdfc0af](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/commit/fdfc0af3995c344bbe7e8872e1bf22d67fc97790))


### Features

* add default positioning for decorators ([f3fbb44](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/commit/f3fbb442edf0f399c1b56054bd9d7cb195216f6d))


### BREAKING CHANGES

* the 1.x.x configuration is no longer compatible.
However, the 2.x.x configuration has better defaults, and should require
less overall configuration between projects.



## [1.0.4](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/compare/v1.0.3...v1.0.4) (2020-03-24)


### Bug Fixes

* package.json version does not match tag ([439b5f3](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/commit/439b5f3a3681bd222c4a3c4969d46cf32b883d17))



## [1.0.3](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/compare/v1.0.2...v1.0.3) (2020-03-24)


### Bug Fixes

* **readme:** update link to ember config in readme ([2efc4f7](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/commit/2efc4f7b56fca141b2105d142673b47c44c90476))



## [1.0.2](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/compare/v1.0.1...v1.0.2) (2020-03-24)


### Bug Fixes

* multi-line decorators now behave appropriately ([c5bf6be](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/commit/c5bf6beee35f3ce98ed6d43573224d9a4272f282))
* update minimum node version in readme ([62b4014](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/commit/62b4014966c140f886bf73ad473709dafdbc23d0))



# [1.0.0](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/compare/afa81888141b8d608491a967565855cc138b26d8...v1.0.0) (2020-03-23)


### Bug Fixes

* use correct semantic-release-cli command ([6ebae4f](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/commit/6ebae4fc65a3c4f14a7cf3449ad60c4e87c929ce))
* use correct semantic-release-cli command ([ac5afdf](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/commit/ac5afdf5b9ee909bd0c9bd4dd788b2594a942b1b))
* use correct semantic-release-cli command ([afa8188](https://github.com/NullVoxPopuli/eslint-plugin-decorator-position/commit/afa81888141b8d608491a967565855cc138b26d8))
