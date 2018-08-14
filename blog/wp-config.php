<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'sanderv7_ss_dbname6c0');

/** MySQL database username */
define('DB_USER', 'sanderv7_ss_d6c0');

/** MySQL database password */
define('DB_PASSWORD', 'qtZYHKLPIZkW');

/** MySQL hostname */
define('DB_HOST', 'localhost');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY', 'dO}!=/IRA?wTiMJg{>q^V}(SXQbGLp?nG^zO>P}Oef!uy$APyY@G(O@;^{<+C/D(SxxE+Ko;{vkMymY@Y)YwJmKF[HP)-Rv[V_jg;;zR_mQJD<S?w*t)JltMY^^wx|?D');
define('SECURE_AUTH_KEY', 'eePqw*h>TDpdx$JK*%Vb@h(QDsVPUo>G?f-=NvA!&CB>i;)FC%j^q*%LE*T)ElhKn;k/S[b-yb?_(y(_@Tu>+>r+?MN_|JfDYvee/Bx$GGF>((cA+u{MNqjwKz$SbI|{');
define('LOGGED_IN_KEY', '%Cg]aEM]PMMZ$Ld=)L_uPrT;$d@IzgrHbiWh!GUyylA%Pre^I>-XCmMjfD&AgUPt?wuen-[wKA+c]h{RWZs-/$^Z(aq|p?sLCJL?uqZXb>bwAR%lWySDCKl[NsEsj_c!');
define('NONCE_KEY', 'CZy[DO(MlVaSWxmU/NNH-j?VLOy!e>?LNO}&Nd>sHkWFGa^KZTD*reFKgd{RBfpOT^^oJRf<}wejW&TCMCtlo]jJCy}TlJE_}seGBfkP!Tt%Z)[(]mvXyG|TOc$PBQob');
define('AUTH_SALT', 'eBYz*^P_hsD_>w+DUF/@-!qC=spZEnj]{xx-A-Zat*Ia&UCNvxfe>rrNi^&fhN*GS>=>J%er&y-wt<?t**lB//yFO^j<%-e_lq/!|IC$BvI-NwJ)uXsN])>xByTRRqzQ');
define('SECURE_AUTH_SALT', ';mHMqXmF=CMk<g-e-haA?{v|vmkh&bvEpDbJXBzOT+Y-O(xzY!C*Zm=[ieuq^Uj-pFeIE^zCW*Xq_}ypdJ+sfW*B^I^jI@E^/ssg=fYW(k-^{}Gtvo+{ituV<W(}t^sl');
define('LOGGED_IN_SALT', '%Mld^A!=Io|*qpQwj$uq+MnBu&_@pNZn<kk[GIl]%@hERarBi$_FB@k|^yTY}t^;}+NUW;AUa^K{Zi&>k<!Mm{;k[_+[]!)IQIe){ZPLKeFaacw*]&ArD|jvMh%Dv&e_');
define('NONCE_SALT', '|>yhe*{?%FtN_I@apfWuDB&tCDh+oqvs|]Y[QE_ym_^nejdhW|OX<a$+^IFdWD@rxJRceRQgQajBF|EJCwta&fcQH)Vi[?kgM?LunY_KTqk$(HL^oWSVO|r+%H!^?NM/');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_yijs_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the Codex.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
define('WP_DEBUG', false);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
