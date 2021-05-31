--
-- Database: `gt-db`
--

-- --------------------------------------------------------

--
-- Table structure for table `country`
--

CREATE TABLE `country` (
  `country_id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `iso_code_2` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `iso_code_3` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `phone_code` int(11) NOT NULL,
  `postcode_required` int(11) NOT NULL DEFAULT 0,
  `is_eu` int(11) NOT NULL DEFAULT 0,
  `is_active` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `country`
--

INSERT INTO `country` (`country_id`, `name`, `iso_code_2`, `iso_code_3`, `phone_code`, `postcode_required`, `is_eu`, `is_active`) VALUES
(1, 'United States', 'US', 'USA', 1, 0, 0, 1),
(2, 'Canada', 'CA', 'CAN', 1, 0, 0, 1),
(3, 'Afghanistan', 'AF', 'AFG', 93, 0, 0, 1),
(4, 'Albania', 'AL', 'ALB', 355, 0, 0, 1),
(5, 'Algeria', 'DZ', 'DZA', 213, 0, 0, 1),
(6, 'American Samoa', 'DS', 'ASM', 44, 0, 0, 1),
(7, 'Andorra', 'AD', 'AND', 376, 0, 0, 1),
(8, 'Angola', 'AO', 'AGO', 244, 0, 0, 1),
(9, 'Anguilla', 'AI', 'AIA', 1264, 0, 0, 1),
(10, 'Antarctica', 'AQ', 'ATA', 672, 0, 0, 1),
(11, 'Antigua and Barbuda', 'AG', 'ATG', 1268, 0, 0, 1),
(12, 'Argentina', 'AR', 'ARG', 54, 0, 0, 1),
(13, 'Armenia', 'AM', 'ARM', 374, 0, 0, 1),
(14, 'Aruba', 'AW', 'ABW', 297, 0, 0, 1),
(15, 'Australia', 'AU', 'AUS', 61, 0, 0, 1),
(16, 'Austria', 'AT', 'AUT', 43, 0, 1, 1),
(17, 'Azerbaijan', 'AZ', 'AZE', 994, 0, 0, 1),
(18, 'Bahamas', 'BS', 'BHS', 1242, 0, 0, 1),
(19, 'Bahrain', 'BH', 'BHR', 973, 0, 0, 1),
(20, 'Bangladesh', 'BD', 'BGD', 880, 0, 0, 1),
(21, 'Barbados', 'BB', 'BRB', 1246, 0, 0, 1),
(22, 'Belarus', 'BY', 'BLR', 375, 0, 0, 1),
(23, 'Belgium', 'BE', 'BEL', 32, 0, 1, 1),
(24, 'Belize', 'BZ', 'BLZ', 501, 0, 0, 1),
(25, 'Benin', 'BJ', 'BEN', 229, 0, 0, 1),
(26, 'Bermuda', 'BM', 'BMU', 1441, 0, 0, 1),
(27, 'Bhutan', 'BT', 'BTN', 975, 0, 0, 1),
(28, 'Bolivia', 'BO', 'BOL', 591, 0, 0, 1),
(29, 'Bosnia and Herzegovina', 'BA', 'BIH', 387, 0, 0, 1),
(30, 'Botswana', 'BW', 'BWA', 267, 0, 0, 1),
(31, 'Bouvet Island', 'BV', '', 44, 0, 0, 1),
(32, 'Brazil', 'BR', 'BRA', 55, 0, 0, 1),
(33, 'British lndian Ocean Territory', 'IO', 'IOT', 0, 0, 0, 1),
(34, 'Brunei Darussalam', 'BN', 'BRN', 673, 0, 0, 1),
(35, 'Bulgaria', 'BG', 'BGR', 359, 0, 1, 1),
(36, 'Burkina Faso', 'BF', 'BFA', 226, 0, 0, 1),
(37, 'Burundi', 'BI', 'BDI', 257, 0, 0, 1),
(38, 'Cambodia', 'KH', 'KHM', 855, 0, 0, 1),
(39, 'Cameroon', 'CM', 'CMR', 237, 0, 0, 1),
(40, 'Cape Verde', 'CV', 'CPV', 238, 0, 0, 1),
(41, 'Cayman Islands', 'KY', 'CYM', 1345, 0, 0, 1),
(42, 'Central African Republic', 'CF', 'CAF', 236, 0, 0, 1),
(43, 'Chad', 'TD', 'TCD', 235, 0, 0, 1),
(44, 'Chile', 'CL', 'CHL', 56, 0, 0, 1),
(45, 'China', 'CN', 'CHN', 86, 0, 0, 1),
(46, 'Christmas Island', 'CX', 'CXR', 61, 0, 0, 1),
(47, 'Cocos (Keeling) Islands', 'CC', 'CCK', 61, 0, 0, 1),
(48, 'Colombia', 'CO', 'COL', 57, 0, 0, 1),
(49, 'Comoros', 'KM', 'COM', 269, 0, 0, 1),
(50, 'Congo', 'CG', 'COG', 242, 0, 0, 1),
(51, 'Cook Islands', 'CK', 'COK', 682, 0, 0, 1),
(52, 'Costa Rica', 'CR', 'CRC', 506, 0, 0, 1),
(53, 'Croatia (Hrvatska)', 'HR', 'HRV', 385, 0, 0, 1),
(54, 'Cuba', 'CU', 'CUB', 53, 0, 0, 1),
(55, 'Cyprus', 'CY', 'CYP', 357, 0, 1, 1),
(56, 'Czech Republic', 'CZ', 'CZE', 420, 0, 1, 1),
(57, 'Denmark', 'DK', 'DNK', 45, 0, 1, 1),
(58, 'Djibouti', 'DJ', 'DJI', 253, 0, 0, 1),
(59, 'Dominica', 'DM', 'DMA', 1767, 0, 0, 1),
(60, 'Dominican Republic', 'DO', 'DOM', 1809, 0, 0, 1),
(61, 'East Timor', 'TP', '', 44, 0, 0, 1),
(62, 'Ecuador', 'EC', 'ECU', 593, 0, 0, 1),
(63, 'Egypt', 'EG', 'EGY', 20, 0, 0, 1),
(64, 'El Salvador', 'SV', 'SLV', 503, 0, 0, 1),
(65, 'Equatorial Guinea', 'GQ', 'GNQ', 240, 0, 0, 1),
(66, 'Eritrea', 'ER', 'ERI', 291, 0, 0, 1),
(67, 'Estonia', 'EE', 'EST', 372, 0, 1, 1),
(68, 'Ethiopia', 'ET', 'ETH', 251, 0, 0, 1),
(69, 'Falkland Islands (Malvinas)', 'FK', 'FLK', 500, 0, 0, 1),
(70, 'Faroe Islands', 'FO', 'FRO', 298, 0, 0, 1),
(71, 'Fiji', 'FJ', 'FJI', 679, 0, 0, 1),
(72, 'Finland', 'FI', 'FIN', 358, 0, 1, 1),
(73, 'France', 'FR', 'FRA', 33, 0, 1, 1),
(74, 'France, Metropolitan', 'FX', '', 44, 0, 0, 1),
(75, 'French Guiana', 'GF', '', 44, 0, 0, 1),
(76, 'French Polynesia', 'PF', 'PYF', 689, 0, 0, 1),
(77, 'French Southern Territories', 'TF', '', 44, 0, 0, 1),
(78, 'Gabon', 'GA', 'GAB', 241, 0, 0, 1),
(79, 'Gambia', 'GM', 'GMB', 220, 0, 0, 1),
(80, 'Georgia', 'GE', 'GEO', 995, 0, 0, 1),
(81, 'Germany', 'DE', 'DEU', 49, 0, 1, 1),
(82, 'Ghana', 'GH', 'GHA', 233, 0, 0, 1),
(83, 'Gibraltar', 'GI', 'GIB', 350, 0, 0, 1),
(84, 'Greece', 'GR', 'GRC', 30, 0, 1, 1),
(85, 'Greenland', 'GL', 'GRL', 299, 0, 0, 1),
(86, 'Grenada', 'GD', 'GRD', 1473, 0, 0, 1),
(87, 'Guadeloupe', 'GP', '', 44, 0, 0, 1),
(88, 'Guam', 'GU', 'GUM', 1671, 0, 0, 1),
(89, 'Guatemala', 'GT', 'GTM', 502, 0, 0, 1),
(90, 'Guinea', 'GN', 'GIN', 224, 0, 0, 1),
(91, 'Guinea-Bissau', 'GW', 'GNB', 245, 0, 0, 1),
(92, 'Guyana', 'GY', 'GUY', 592, 0, 0, 1),
(93, 'Haiti', 'HT', 'HTI', 509, 0, 0, 1),
(94, 'Heard and Mc Donald Islands', 'HM', '', 44, 0, 0, 1),
(95, 'Honduras', 'HN', 'HND', 504, 0, 0, 1),
(96, 'Hong Kong', 'HK', 'HKG', 852, 0, 0, 1),
(97, 'Hungary', 'HU', 'HUN', 36, 0, 1, 1),
(98, 'Iceland', 'IS', 'IS', 354, 0, 0, 1),
(99, 'India', 'IN', 'IND', 91, 0, 0, 1),
(100, 'Indonesia', 'ID', 'IDN', 62, 0, 0, 1),
(101, 'Iran (Islamic Republic of)', 'IR', 'IRN', 98, 0, 0, 1),
(102, 'Iraq', 'IQ', 'IRQ', 964, 0, 0, 1),
(103, 'Ireland', 'IE', 'IRL', 353, 0, 1, 1),
(104, 'Israel', 'IL', 'ISR', 972, 0, 0, 1),
(105, 'Italy', 'IT', 'ITA', 39, 0, 1, 1),
(106, 'Ivory Coast', 'CI', 'CIV', 225, 0, 0, 1),
(107, 'Jamaica', 'JM', 'JAM', 1876, 0, 0, 1),
(108, 'Japan', 'JP', 'JPN', 81, 0, 0, 1),
(109, 'Jordan', 'JO', 'JOR', 962, 0, 0, 1),
(110, 'Kazakhstan', 'KZ', 'KAZ', 7, 0, 0, 1),
(111, 'Kenya', 'KE', 'KEN', 254, 0, 0, 1),
(112, 'Kiribati', 'KI', 'KIR', 686, 0, 0, 1),
(113, 'Korea, Democratic People\'s Republic of', 'KP', 'PRK', 850, 0, 0, 1),
(114, 'Korea, Republic of', 'KR', 'KOR', 82, 0, 0, 1),
(115, 'Kuwait', 'KW', 'KWT', 965, 0, 0, 1),
(116, 'Kyrgyzstan', 'KG', 'KGZ', 996, 0, 0, 1),
(117, 'Lao People\'s Democratic Republic', 'LA', 'LAO', 856, 0, 0, 1),
(118, 'Latvia', 'LV', 'LVA', 371, 0, 1, 1),
(119, 'Lebanon', 'LB', 'LBN', 961, 0, 0, 1),
(120, 'Lesotho', 'LS', 'LSO', 266, 0, 0, 1),
(121, 'Liberia', 'LR', 'LBR', 231, 0, 0, 1),
(122, 'Libyan Arab Jamahiriya', 'LY', 'LBY', 218, 0, 0, 1),
(123, 'Liechtenstein', 'LI', 'LIE', 423, 0, 0, 1),
(124, 'Lithuania', 'LT', 'LTU', 370, 0, 1, 1),
(125, 'Luxembourg', 'LU', 'LUX', 352, 0, 1, 1),
(126, 'Macau', 'MO', 'MAC', 853, 0, 0, 1),
(127, 'Macedonia', 'MK', 'MKD', 389, 0, 0, 1),
(128, 'Madagascar', 'MG', 'MDG', 261, 0, 0, 1),
(129, 'Malawi', 'MW', 'MWI', 265, 0, 0, 1),
(130, 'Malaysia', 'MY', 'MYS', 60, 0, 0, 1),
(131, 'Maldives', 'MV', 'MDV', 960, 0, 0, 1),
(132, 'Mali', 'ML', 'MLI', 223, 0, 0, 1),
(133, 'Malta', 'MT', 'MLT', 356, 0, 1, 1),
(134, 'Marshall Islands', 'MH', 'MHL', 692, 0, 0, 1),
(135, 'Martinique', 'MQ', '', 44, 0, 0, 1),
(136, 'Mauritania', 'MR', 'MRT', 222, 0, 0, 1),
(137, 'Mauritius', 'MU', 'MUS', 230, 0, 0, 1),
(138, 'Mayotte', 'TY', 'MYT', 262, 0, 0, 1),
(139, 'Mexico', 'MX', 'MEX', 52, 0, 0, 1),
(140, 'Micronesia, Federated States of', 'FM', 'FSM', 691, 0, 0, 1),
(141, 'Moldova, Republic of', 'MD', 'MDA', 373, 0, 0, 1),
(142, 'Monaco', 'MC', 'MCO', 377, 0, 0, 1),
(143, 'Mongolia', 'MN', 'MNG', 976, 0, 0, 1),
(144, 'Montserrat', 'MS', 'MSR', 1664, 0, 0, 1),
(145, 'Morocco', 'MA', 'MAR', 212, 0, 0, 1),
(146, 'Mozambique', 'MZ', 'MOZ', 258, 0, 0, 1),
(147, 'Myanmar', 'MM', 'MMR', 95, 0, 0, 1),
(148, 'Namibia', 'NA', 'NAM', 264, 0, 0, 1),
(149, 'Nauru', 'NR', 'NRU', 674, 0, 0, 1),
(150, 'Nepal', 'NP', 'NPL', 977, 0, 0, 1),
(151, 'Netherlands', 'NL', 'NLD', 31, 0, 1, 1),
(152, 'Netherlands Antilles', 'AN', 'ANT', 599, 0, 0, 1),
(153, 'New Caledonia', 'NC', 'NCL', 687, 0, 0, 1),
(154, 'New Zealand', 'NZ', 'NZL', 64, 0, 0, 1),
(155, 'Nicaragua', 'NI', 'NIC', 505, 0, 0, 1),
(156, 'Niger', 'NE', 'NER', 227, 0, 0, 1),
(157, 'Nigeria', 'NG', 'NGA', 234, 0, 0, 1),
(158, 'Niue', 'NU', 'NIU', 683, 0, 0, 1),
(159, 'Norfork Island', 'NF', '', 44, 0, 0, 1),
(160, 'Northern Mariana Islands', 'MP', 'MNP', 1670, 0, 0, 1),
(161, 'Norway', 'NO', 'NOR', 47, 0, 0, 1),
(162, 'Oman', 'OM', 'OMN', 968, 0, 0, 1),
(163, 'Pakistan', 'PK', 'PAK', 92, 0, 0, 1),
(164, 'Palau', 'PW', 'PLW', 680, 0, 0, 1),
(165, 'Panama', 'PA', 'PAN', 507, 0, 0, 1),
(166, 'Papua New Guinea', 'PG', 'PNG', 675, 0, 0, 1),
(167, 'Paraguay', 'PY', 'PRY', 595, 0, 0, 1),
(168, 'Peru', 'PE', 'PER', 51, 0, 0, 1),
(169, 'Philippines', 'PH', 'PHL', 63, 0, 0, 1),
(170, 'Pitcairn', 'PN', 'PCN', 870, 0, 0, 1),
(171, 'Poland', 'PL', 'POL', 48, 0, 1, 1),
(172, 'Portugal', 'PT', 'PRT', 351, 0, 1, 1),
(173, 'Puerto Rico', 'PR', 'PRI', 1, 0, 0, 1),
(174, 'Qatar', 'QA', 'QAT', 974, 0, 0, 1),
(175, 'Reunion', 'RE', '', 44, 0, 0, 1),
(176, 'Romania', 'RO', 'ROU', 40, 0, 1, 1),
(177, 'Russian Federation', 'RU', 'RUS', 7, 0, 0, 1),
(178, 'Rwanda', 'RW', 'RWA', 250, 0, 0, 1),
(179, 'Saint Kitts and Nevis', 'KN', 'KNA', 1869, 0, 0, 1),
(180, 'Saint Lucia', 'LC', 'LCA', 1758, 0, 0, 1),
(181, 'Saint Vincent and the Grenadines', 'VC', 'VCT', 1784, 0, 0, 1),
(182, 'Samoa', 'WS', 'WSM', 685, 0, 0, 1),
(183, 'San Marino', 'SM', 'SMR', 378, 0, 0, 1),
(184, 'Sao Tome and Principe', 'ST', 'STP', 239, 0, 0, 1),
(185, 'Saudi Arabia', 'SA', 'SAU', 966, 0, 0, 1),
(186, 'Senegal', 'SN', 'SEN', 221, 0, 0, 1),
(187, 'Seychelles', 'SC', 'SYC', 248, 0, 0, 1),
(188, 'Sierra Leone', 'SL', 'SLE', 232, 0, 0, 1),
(189, 'Singapore', 'SG', 'SGP', 65, 0, 0, 1),
(190, 'Slovakia', 'SK', 'SVK', 421, 0, 1, 1),
(191, 'Slovenia', 'SI', 'SVN', 386, 0, 1, 1),
(192, 'Solomon Islands', 'SB', 'SLB', 677, 0, 0, 1),
(193, 'Somalia', 'SO', 'SOM', 252, 0, 0, 1),
(194, 'South Africa', 'ZA', 'ZAF', 27, 0, 0, 1),
(195, 'South Georgia South Sandwich Islands', 'GS', '', 44, 0, 0, 1),
(196, 'Spain', 'ES', 'ESP', 34, 0, 1, 1),
(197, 'Sri Lanka', 'LK', 'LKA', 94, 0, 0, 1),
(198, 'St. Helena', 'SH', 'SHN', 290, 0, 0, 1),
(199, 'St. Pierre and Miquelon', 'PM', 'SPM', 508, 0, 0, 1),
(200, 'Sudan', 'SD', 'SDN', 249, 0, 0, 1),
(201, 'Suriname', 'SR', 'SUR', 597, 0, 0, 1),
(202, 'Svalbarn and Jan Mayen Islands', 'SJ', 'SJM', 0, 0, 0, 1),
(203, 'Swaziland', 'SZ', 'SWZ', 268, 0, 0, 1),
(204, 'Sweden', 'SE', 'SWE', 46, 0, 1, 1),
(205, 'Switzerland', 'CH', 'CHE', 41, 0, 0, 1),
(206, 'Syrian Arab Republic', 'SY', 'SYR', 963, 0, 0, 1),
(207, 'Taiwan', 'TW', 'TWN', 886, 0, 0, 1),
(208, 'Tajikistan', 'TJ', 'TJK', 992, 0, 0, 1),
(209, 'Tanzania, United Republic of', 'TZ', 'TZA', 255, 0, 0, 1),
(210, 'Thailand', 'TH', 'THA', 66, 0, 0, 1),
(211, 'Togo', 'TG', 'TGO', 228, 0, 0, 1),
(212, 'Tokelau', 'TK', 'TKL', 690, 0, 0, 1),
(213, 'Tonga', 'TO', 'TON', 676, 0, 0, 1),
(214, 'Trinidad and Tobago', 'TT', 'TTO', 1868, 0, 0, 1),
(215, 'Tunisia', 'TN', 'TUN', 216, 0, 0, 1),
(216, 'Turkey', 'TR', 'TUR', 90, 0, 0, 1),
(217, 'Turkmenistan', 'TM', 'TKM', 993, 0, 0, 1),
(218, 'Turks and Caicos Islands', 'TC', 'TCA', 1649, 0, 0, 1),
(219, 'Tuvalu', 'TV', 'TUV', 688, 0, 0, 1),
(220, 'Uganda', 'UG', 'UGA', 256, 0, 0, 1),
(221, 'Ukraine', 'UA', 'UKR', 380, 0, 0, 1),
(222, 'United Arab Emirates', 'AE', 'ARE', 971, 0, 0, 1),
(223, 'United Kingdom', 'GB', 'GBR', 44, 1, 1, 1),
(224, 'United States minor outlying islands', 'UM', '', 44, 0, 0, 1),
(225, 'Uruguay', 'UY', 'URY', 598, 0, 0, 1),
(226, 'Uzbekistan', 'UZ', 'UZB', 998, 0, 0, 1),
(227, 'Vanuatu', 'VU', 'VUT', 678, 0, 0, 1),
(228, 'Vatican City State', 'VA', 'VAT', 39, 0, 0, 1),
(229, 'Venezuela', 'VE', 'VEN', 58, 0, 0, 1),
(230, 'Vietnam', 'VN', 'VNM', 84, 0, 0, 1),
(231, 'Virigan Islands (British)', 'VG', 'VGB', 1284, 0, 0, 1),
(232, 'Virgin Islands (U.S.)', 'VI', 'VIR', 1340, 0, 0, 1),
(233, 'Wallis and Futuna Islands', 'WF', 'WLF', 681, 0, 0, 1),
(234, 'Western Sahara', 'EH', 'ESH', 0, 0, 0, 1),
(235, 'Yemen', 'YE', 'YEM', 967, 0, 0, 1),
(236, 'Yugoslavia', 'YU', '', 44, 0, 0, 1),
(237, 'Zaire', 'ZR', '', 44, 0, 0, 1),
(238, 'Zambia', 'ZM', 'ZMB', 260, 0, 0, 1),
(239, 'Zimbabwe', 'ZW', 'ZWE', 263, 0, 0, 1),
(240, 'Kosovo', 'XK', '', 381, 0, 0, 1),
(243, 'Montenegro', 'ME', 'MNE', 382, 0, 0, 1),
(386, 'Serbia', 'RS', 'SRB', 381, 0, 0, 1),
(387, 'Palestine', 'PS', 'PS', 970, 0, 0, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `country`
--
ALTER TABLE `country`
  ADD PRIMARY KEY (`country_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `country`
--
ALTER TABLE `country`
  MODIFY `country_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=388;
COMMIT;

