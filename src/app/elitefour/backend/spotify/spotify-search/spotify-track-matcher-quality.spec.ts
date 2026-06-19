import {itAutoMatches, itDoesNotAutoMatch, track} from './spotify-track-matcher-spec-helper';

describe('SpotifyTrackMatcher quality cases', () => {
  describe('auto-match cases', () => {
    itAutoMatches('CHVRCHES & Robert Smith – How Not To Drown', '0gNnngLmd8zSikRqUGt2DU', [
      track('How Not To Drown (feat. Robert Smith)', ['CHVRCHES', 'Robert Smith'], '0gNnngLmd8zSikRqUGt2DU'),
      track('How Not To Drown (feat. Robert Smith) [Robert Smith Remix]', ['CHVRCHES', 'Robert Smith'], '1EE8j9Wmus9CfsLaP9VWLK'),
      track('Sleep On The Floor', 'The Lumineers', '4RvW5ggYKC7bCDX4UUSSDc'),
      track('Impossible', 'Nothing But Thieves', '4ZEvO7TZQTbUGJzqjcPFDD'),
      track('Da Joint', 'EPMD', '16k9LAqwXvd0YUwf27JTso'),
      track('A.D.H.D', 'Kendrick Lamar', '2Fw5S2gaOSZzdN5dFoC2dj')
    ]);

    itAutoMatches('Eros Ramazzotti – Un Emozione Per Sempre', '1Hd8GLavCUUUx3GJdunJ4E', [
      track('Un\'emozione per sempre', 'Eros Ramazzotti', '1Hd8GLavCUUUx3GJdunJ4E'),
      track('Un\'emozione per sempre (feat. Ultimo)', ['Eros Ramazzotti', 'Ultimo'], '4XekmR0bCUkZ44NLanVbhT'),
      track('Se bastasse una canzone', 'Eros Ramazzotti', '7dp45uA0Ws4TadWaMwdIRw'),
      track('Cose Della Vita (with Tina Turner)', ['Eros Ramazzotti', 'Tina Turner'], '2bJtJv5NGkYUFP6prU3WSg'),
      track('Più bella cosa', 'Eros Ramazzotti', '0KligwQn4Iy344p2Q5m6k6'),
      track('Niente', 'Ultimo', '7l87A53SidoE3XQ1aaG7Qt'),
      track('Sopra la stessa barca', ['Olly', 'Enrico Nigiotti', 'Juli'], '2uIDhpypQYFb3PpczWXH0v'),
      track('Volare (Cantare Oh Oh Oh Oh) - Felice Di Stare Lassu', 'Radio Edit', '50w2Kiu3PHNeNLaS5EWIsf')
    ]);

    itAutoMatches('Swedish House Mafia & The Weeknd – Moth to a Flame', '7kfOEMJBJwdCYqyJeEnNhr', [
      track('Moth To A Flame (with The Weeknd)', ['Swedish House Mafia', 'The Weeknd'], '7kfOEMJBJwdCYqyJeEnNhr'),
      track('Moth To A Flame (with The Weeknd) - Extended Mix', ['Swedish House Mafia', 'The Weeknd'], '7adZFwp4PnLDL2QrQhv8fD'),
      track('Moth To A Flame (with The Weeknd, Moojo) - Moojo Remix', ['Swedish House Mafia', 'The Weeknd', 'Moojo'], '40MXr7BMh3ShPf2b9giSRt'),
      track('Moth To A Flame (feat. The Weeknd) - Adriatique Remix', ['Swedish House Mafia', 'Adriatique', 'The Weeknd'], '1G3kwVs3JHqN5UPiFXcAID'),
      track('Gone Gone Gone', ['David Guetta', 'Teddy Swims', 'Tones And I'], '3Dy4xsff7c0fRaTJpA54yd')
    ]);

    itAutoMatches('Alan Parsons Project – Old And Wise', '5qdlMWYpCtJFsHey3rXYms', [
      track('Old and Wise', 'The Alan Parsons Project', '5qdlMWYpCtJFsHey3rXYms'),
      track('Old and Wise - Eric Woolfson Guide Vocal', 'The Alan Parsons Project', '2K4UIgUSm5BIBc1ziTtBvO'),
      track('Eye In The Sky', 'The Alan Parsons Project', '2sIbHjfJ3nbMXNz4w03fWv'),
      track('Old and Wise - Live', 'The Alan Parsons Symphonic Project', '7AwdOTnvwal9ocQUiugORV'),
      track('Destroy Rock & Roll', 'Mylo', '74dRHeSOK7qTcFE2C0HOat'),
      track('Push & Rise - Radio Edit', 'Wolfgang Gartner', '1osgjECeUpUPmRtB50DhF1'),
      track('Imagination of House - Totally House Version', 'DJ Hooligan', '2B4ICMEucvVFSUbcMIn8KC'),
      track('(Who?) Keeps Changing Your Mind? - Daniel Bovie & Roy Rox Chill Edit', 'South Street Player', '2mgSPLugVPqSVFDb8JRNJa')
    ]);

    itAutoMatches('Eminem – Stan', '3UmaczJpikHgJFyBTAJVoz', [
      track('Stan', ['Eminem', 'Dido'], '3UmaczJpikHgJFyBTAJVoz'),
      track('Lose Yourself', 'Eminem', '5Z01UMMf7V1o0MzF86s6WJ'),
      track('Without Me', 'Eminem', '7lQ8MOhq6IN2w8EYcFNSUk'),
      track('Love The Way You Lie', ['Eminem', 'Rihanna'], '15JINEqzVMv3SvJTAXAKED'),
      track('The Real Slim Shady', 'Eminem', '3yfqSUWxFvZELEM4PmlwIR')
    ]);

    itAutoMatches('Maitre Gims – J’me Tire', '4w47YE9rjhmZUdtZjSCb82', [
      track('J\'me tire', 'GIMS', '4w47YE9rjhmZUdtZjSCb82'),
      track('AIR FORCE BLANCHE', ['GIMS', 'Jul'], '6bcDH1OOwuKzfsByqsQKhH'),
      track('Soleil', 'GIMS', '2QfcxxXiORn553zXq7qrFG'),
      track('Paris va bien', 'Sexion d\'Assaut', '2tEEgc5iR3WVucXl8lNHV4'),
      track('Est-ce que tu m\'aimes ? - Pilule bleue', 'GIMS', '3a9TMd2Yrza6HXqqlfMtfy'),
      track('MPC NECRONOMICON', ['Jeune Wakanda', 'Lynothecosmoskid'], '71X3Oyj1VXFkLRY2BWAPfY')
    ]);

    itAutoMatches('Kygo feat. DNCE – Dancing Feet', '4RAR8g8fZNB106ezUurnE0', [
      track('Dancing Feet (feat. DNCE)', ['Kygo', 'DNCE'], '4RAR8g8fZNB106ezUurnE0'),
      track('Firestone', ['Kygo', 'Conrad Sewell'], '1I8tHoNBFTuoJAlh4hfVVE'),
      track('Save My Love', ['Kygo', 'Khalid', 'Gryffin'], '5ObyGDxNWH0Uuuk3NvC5r8'),
      track('Stranger By Degrees', ['Squeeze Mason', 'Danesa'], '5OFvUIlthJoR6aRYdGPtit'),
      track('Breathe', 'Leaves', '1G6AJYub1xYxRjWMEWDUuz'),
      track('414 Scurvy (Posse Cut)', ['Daark', 'AyooLii', 'Superstar Sel', 'kill.dawn', 'Maz G', 'Stix', 'Dalenkwent'], '3LjhWf04laxO2zTlc2brRE'),
      track('Room', 'SoundsByEYE', '6kvqSEbpDsiVwzl138ooZw')
    ]);

    itAutoMatches('Joci Pápai – Az Én Apám', '7BxvOHOaRr6v7VDLKKdeYw', [
      track('Az Én Apám', 'Pápai Joci', '7BxvOHOaRr6v7VDLKKdeYw'),
      track('Papa en Mama', 'Joost', '24zWtY0TOV4vKGebeJVDT8'),
      track('Az Én Apám - ESC Version', 'Pápai Joci', '6u8h2szk9uZis4czmg2KBE'),
      track('Az Én Apám - Karaoke Version', 'Pápai Joci', '7e4CANfq4nL1HkYykf07Pv'),
      track('Az én apám (Eurovision 2019) [8-Bit Joci Pápai Emulation]', '8-Bit Arcade', '7eah8AwfLFyUWftyMKheil'),
      track('Pappa Is Thuis', 'De Jeugd Van Tegenwoordig', '7E6MLf3XLmIHrDArQJJWMZ'),
      track('Tündi Bündi', ['Majka', 'Tyson'], '4TJUTvdks0xP0p39OcN8ax'),
      track('Belehalok', ['Majka', 'Curtis', 'Blr'], '1bnvChZ7MDWYgvPI7VVax9'),
      track('SZEPTEMBER VÉGÉN - STRESSZ', ['Mehringer', 'sosehol'], '0N2psFXNrnUdWW6aCsMEgd')
    ]);

    itAutoMatches('Avantasia – The Scarecrow', '1bCTt8s6cMFww1SqtLuWpH', [
      track('The Scarecrow', ['Avantasia', 'Jorn Lande', 'Michael Kiske'], '1bCTt8s6cMFww1SqtLuWpH'),
      track('Scarecrow', ['AYAWAKE', 'Be Svendsen'], '6ZMvunZhqQbcZTUxrHU9GU'),
      track('Moonglow', ['Avantasia', 'Candice Night'], '1fKaObKEtnVZrnhcqqLKAx'),
      track('The Toy Master', ['Avantasia', 'Alice Cooper'], '6TH86ZbjnDQa7OWb5vt8by'),
      track('Twistet Mind', ['Avantasia', 'Roy Khan'], '0MuUzDoj0PkFGi2NXHPSG2'),
      track('Lost in Space', ['Avantasia', 'Amanda Somerville'], '6ZYZ2dG4T23uIZkCOEt7Xc'),
      track('Kill The Pain Away', ['Avantasia', 'Floor Jansen'], '6gsibCeNm8fOruuYoLRRch'),
      track('harvest sky', ['Oklou', 'underscores'], '3M8bJdRfYj1S5iKZIgwAnH'),
      track('Plastic 100°C', 'Sampha', '7MOgLN4PHcXhhTZLchodnC'),
      track('Half On a Sack', 'Three 6 Mafia', '4jA9iztK8seGSGo05lJ0Cu')
    ]);

    itAutoMatches('E-Type – Forever More', '2bfxCJXbbTV4phk02ipGYm', [
      track('Forever More', ['E-Type', 'Nana Hedin'], '2bfxCJXbbTV4phk02ipGYm'),
      track('Life', ['E-Type', 'Nana Hedin'], '41Ef0PikCCRBcIM8O0t5HK'),
      track('Campione 2000 - Radio Version', 'E-Type', '78UcxP3Xm0EOXneQUDsStA'),
      track('Dilemma', ['Nelly', 'Kelly Rowland'], '0ARK753YaiJbpLUk7z5yIM'),
      track('End Of An Era', 'Dua Lipa', '1YrY0vjHWp672gt0crtj5A'),
      track('Luv U More - K&A\'s Radio Blast', ['Paul Elstak', 'K&A'], '0tFg9xLxPCZWwV01Dd7Orr')
    ]);

    itAutoMatches('Pendulum feat. Steven Wilson – The Fountain', '5blXK1R7GYL7gY2PVGxC90', [
      track('The Fountain (feat. Steven Wilson)', ['Pendulum', 'Steven Wilson'], '5blXK1R7GYL7gY2PVGxC90'),
      track('Pendulum Swing', 'Goldkimono', '6yOXhRvvqmABDbGlOtOUWA'),
      track('Watercolour - Full Version; Single', 'Pendulum', '5ami95W9OOWQPwrBb5tud5'),
      track('Witchcraft', 'Pendulum', '4Y2glvLjQGOb4dXnwm1hQf'),
      track('Halo', ['Pendulum', 'Bullet For My Valentine'], '7zu3XegIqvsEk3xqqbta1l'),
      track('Archangel', 'Pendulum', '7ExlSLGvPNDoZ9nEu17nCV'),
      track('Sound of You', ['Pendulum', 'Armin van Buuren', 'Rob Swire'], '4J4KcVmHSypHymgMpAP9cn'),
      track('Tarantula - Original Mix', ['Pendulum', 'Tenor Fly', 'MC Spyda', 'DJ Fresh'], '0G7qyvqwjfMdHZn4RwiAdf'),
      track('Crush', 'Pendulum', '6hzwfFKrTabeUsW5SWti17'),
      track('Voodoo People - Pendulum Mix', ['The Prodigy', 'Pendulum'], '5wqlRFdpJ1a4kMIBSWeCnN')
    ]);

    itAutoMatches('Mumford & Sons – The Cave', '2HRpLui16GCENLFDXrnNkO', [
      track('The Cave', 'Mumford & Sons', '2HRpLui16GCENLFDXrnNkO'),
      track('The Cave - Live at Studio Brussel', 'Mumford & Sons', '0vFx4Z9tMwft2w1GfKugO3'),
      track('The Cave - Live from Redrocks, Colorado', 'Mumford & Sons', '2vgwFSsqNtMBx5RPorW7Fm'),
      track('The Cave - Live From Red Rocks, Colorado', 'Mumford & Sons', '0O1NqFvae7cuazLP7TfpHI'),
      track('Little Lion Man', 'Mumford & Sons', '3GfgC3AawvFSCowb90vpzl'),
      track('On the Flip of a Coin', 'The Streets', '20Of7eVar4CrMt40cm3SpI'),
      track('General', 'JID', '7hJvx1rJTUsKUngnHdBuir'),
      track('TEN', 'Johnny Rain', '5cbU2DlAgLpVSwwmYdwteD')
    ]);

    itAutoMatches('Kygo – Remind Me To Forget', '5sIx4BlfYGuZeSLF40N9GH', [
      track('Remind Me to Forget', ['Kygo', 'Miguel'], '5sIx4BlfYGuZeSLF40N9GH'),
      track('Remind Me to Forget - Young Bombs Remix', ['Kygo', 'Miguel', 'Young Bombs'], '6yOpXepZKPzGnL1qfDQqy6'),
      track('Remind Me to Forget - Syn Cole Remix', ['Kygo', 'Miguel', 'Syn Cole'], '5zb4vSFqjju8fXuPPHenHV'),
      track('Firestone', ['Kygo', 'Conrad Sewell'], '1I8tHoNBFTuoJAlh4hfVVE'),
      track('Save My Love', ['Kygo', 'Khalid', 'Gryffin'], '5ObyGDxNWH0Uuuk3NvC5r8'),
      track('In This Darkness', 'Clara La San', '0bmVH05tjN9jVh3kB1TfpR'),
      track('Chasing Cars', 'Snow Patrol', '5hnyJvgoWiQUYZttV4wXy6')
    ]);

    itAutoMatches('Epica – Reverence', '5LgxqmlWRgKzc3juZJE7eR', [
      track('Reverence - Living in the Heart', 'Epica', '5LgxqmlWRgKzc3juZJE7eR'),
      track('Rivers', 'Epica', '6SO03S6E3WsdfUsrdz447z'),
      track('Unleashed', 'Epica', '2EO2MCzUHcZ1L8NWx2vYSJ'),
      track('Arcana', 'Epica', '0DHT1NIE5MGSIGxn2jDpXC'),
      track('Apparition', 'Epica', '76um1xGYTadmMZMDOBiGez'),
      track('Obsidian Heart', 'Epica', '4ULuGrko8xKdiH7QWUyJKL'),
      track('Storm the Sorrow', 'Epica', '54dFYX1WmZFpu3Teceo5lY'),
      track('The Reckoning', ['Within Temptation', 'Jacoby Shaddix'], '6XnPopwCZ6odHVVqMsllL5'),
      track('Cry for the Moon (The Embrace That Smothers , Pt. 4)', 'Epica', '66iX4HzM7YnmxmUZOSCG2F'),
      track('Iron', 'Within Temptation', '3iSgRJUrMKHLglnrQrQ6kO')
    ]);

    itAutoMatches('Mumford & Sons – Dust Bowl Dance', '6rTdwouO3A55SjIjuiECic', [
      track('Dust Bowl Dance', 'Mumford & Sons', '6rTdwouO3A55SjIjuiECic'),
      track('Dust Bowl Dance', 'Piano Tribute Players', '58CffPoTTg71s8YyW4IBY4'),
      track('Dust Bowl Dance', 'Mumford & Sons Lullabies Tribute Band', '2evcT2L9KmRwdvFnoAKmDu'),
      track('Little Lion Man', 'Mumford & Sons', '3GfgC3AawvFSCowb90vpzl'),
      track('Free Mumia', ['KRS-One', 'Channel Live'], '4y3oNpBosiSWmZ33VabBSU'),
      track('Free Mumia (feat. Channel Live)', ['KRS-One', 'Channel Live'], '0MLACl0DTHIHoIp05znzWv'),
      track('General', 'JID', '7hJvx1rJTUsKUngnHdBuir')
    ]);
    itAutoMatches('Red Hot Chilli Peppers – Snow', '2aibwv5hGXSgw7Yru8IYTO', [
      track('Snow (Hey Oh)', 'Red Hot Chili Peppers', '2aibwv5hGXSgw7Yru8IYTO'),
      track('Californication', 'Red Hot Chili Peppers', '48UPSzbZjgc449aqz8bxox'),
      track('Morto Mai (Piano Solo)', 'Lazza', '4hZAxSYVhaiFousCQM8LFc'),
      track('Rent Free', 'Evening Elephants', '59KWwau64vJT19aPa3AGgs'),
      track('Anthony Kiedis', 'Remi Wolf', '3xJu5hrOU9OvFQSGLQiwQS'),
      track('Spicy', 'Julia Cole', '341ZTkDVk7H16f8gZGeiCb')
    ]);

    itAutoMatches('Gotye – Somebody That I Used To Know', '62oaDoBveZxvZb94ziiMXi', [
      track('Somebody That I Used to Know', ['Gotye', 'Kimbra'], '62oaDoBveZxvZb94ziiMXi'),
      track('Somebody That I Used to Know - Tiësto Remix', ['Gotye', 'Kimbra', 'Tiësto'], '7evghanJhRYTJlS8OYO7OI'),
      track('Somebody That I Used to Know - 4frnt Remix', ['Gotye', 'Kimbra', '4FRNT'], '6t1XG2KzhiXjoFCuP3YpZp'),
      track('Somebody That I Used To Know', ['Kevin McKay', 'James Cole', 'Darcey', 'Simon Ellis'], '6h49997adA3XWCX9zMQKbX'),
      track('Somebody I Used to Know - Tiësto Remix', ['Gotye', 'Kimbra'], '013CED9qUgt808UQr9jSPm'),
      track('Somebody (2024)', ['Gotye', 'FISHER', 'Chris Lake', 'Sante Sansone', 'Kimbra'], '124A7neNKBP0Ps8p6PMLy8'),
      track('Peach Scent (Bonus Track)', 'HOKES', '5y7mWnNxUPRv66vqeTcnZv'),
      track('Xxplosive', ['Dr. Dre', 'Hittman', 'Six-Two', 'Nate Dogg', 'Kurupt'], '0Ed7MeXx64f6OcIuoTRCg1')
    ]);

    itAutoMatches('Years & Years – King', '3AeicLnm55RqcXGBKYQolM', [
      track('King', 'Olly Alexander (Years & Years)', '3AeicLnm55RqcXGBKYQolM'),
      track('Light Years', 'The National', '2GNj9KRwpxBWgEiPQc3jEj'),
      track('King', 'TWOPILOTS', '7yH9SbrDQfNIh89ACCR7Ib'),
      track('Vision in Rags', 'Young Knives', '0jswJSX6HNgUuJ1gjoHW32'),
      track('Praise', 'Mayor Boss', '7FPg8hDoCxaRk5OU2Xefds'),
      track('Love Letter', 'Mulaa Joans', '4QcFLrc1uns09taWo7yFsa'),
      track('lovely (with Khalid)', ['Billie Eilish', 'Khalid'], '0u2P5u6lvoDfwTYjAADbn4')
    ]);

    itAutoMatches('Chvrches – High Enough To Carry You', '5Y6SK2R1ZTbYcui9tnCICH', [
      track('High Enough To Carry You Over', 'CHVRCHES', '5Y6SK2R1ZTbYcui9tnCICH'),
      track('War', 'Kensington', '6mEl7vK6usgdsNm4QFHeEd'),
      track('Streets', 'Kensington', '61ks9qYaFaMxUGpYsl1BCF'),
      track('I Found You', ['Sub Focus', 'HAYLA'], '1AA8Uqpa1CbUmopvzmUjFp'),
      track('Kick, Push', 'Lupe Fiasco', '6nz35DNIzbtj5ztpDEcW1j'),
      track('Promises (with Sam Smith) - David Guetta Remix', ['Calvin Harris', 'Sam Smith', 'David Guetta'], '3Lv3frZVXU7Q0JEFvLIzWW'),
      track('Carry Out (Featuring Justin Timberlake)', ['Timbaland', 'Justin Timberlake'], '2DHc2e5bBn4UzY0ENVFrUl'),
      track('Impossible', 'Nothing But Thieves', '4ZEvO7TZQTbUGJzqjcPFDD')
    ]);

    itAutoMatches('Marion Raven – For You I’ll Die', '0bDdcWRhdD71DoiyoSK4Vo', [
      track('For You I\'ll Die', 'Marion Ravn', '0bDdcWRhdD71DoiyoSK4Vo'),
      track('Marion Polka', 'Frits Stein', '2KUS7dk6hzRlR9HAfQ4Hs6'),
      track('Die for You', ['Nikko Mad', 'Dual Sessions', 'Olivia Wayne'], '3y2KUPw26uBZbwxs1pM4KK'),
      track('I Would Die 4 U', 'Prince', '3QszJeuSyyZQmD9pY1tqpo'),
      track('For You', 'REBEL-Movemen-T', '3b2MFSlKdIOGahEBQcrWCz'),
      track('Safety - On June Remix', ['Other', 'Brandon Banks', 'On June'], '6bOU3eob4Y8oEjjO8IzQiF'),
      track('I Know What You Want (feat. Flipmode Squad)', ['Busta Rhymes', 'Mariah Carey', 'Flipmode Squad'], '3oairMMtNVnUppKwroxou4'),
      track('Dial Drunk', 'Noah Kahan', '0caJ2wkqp4UmXBwdR2JvB5'),
      track('Meet Me Halfway', 'Black Eyed Peas', '3F9ByoUqu31xU0I3G5xfVg')
    ]);

    itAutoMatches('Chipz – Ch!pz In Black', '1maRB5Epd77jduOZxRkZ3j', [
      track('CH!PZ In Black (Who You Gonna Call)', 'Chipz', '1maRB5Epd77jduOZxRkZ3j'),
      track('CH!PZ In Black - Remix', ['Chipz', 'Henry Chu'], '66afp96xcTrQC0H2QrbKAz'),
      track('Cowboy', 'Chipz', '2o70uYnZ8yoP1zLHWqRJKD'),
      track('1001 Arabian Nights', 'Chipz', '2TL9ng664CxAiRs37Hfa2Z'),
      track('One, Two, Three!', 'Chipz', '2AOsfYqKnhaoW0T1IDqGIk'),
      track('Victory Lap', ['Fred again..', 'Skepta', 'PlaqueBoyMax'], '6fo0FEIVz9aQJjsbKyzy2a'),
      track('bissu dumm ¿ MEGALODON REMIX', ['Bonez MC', 'Nate57', 'JUGGLERZ', 'AchtVier', 'AK 33', 'AK AUSSERKONTROLLE', 'AZAD', 'Big Toe', 'CANEY030', 'Celo & Abdi'], '1IMa0Il4w988MwZCUcISix')
    ]);

    itAutoMatches('Zala & Gasper – Sebi', '1kXDk1RaOZcIfxdQCVxMWK', [
      track('Sebi', 'zalagasper', '1kXDk1RaOZcIfxdQCVxMWK'),
      track('Sebi - Dare To Dream Version', 'zalagasper', '5g9mbYv5JL9AIa9lKw2EHJ'),
      track('Zal', 'Šaban Šaulić', '13Bu94heOw6OHWLaDF83no'),
      track('Sećaš Li Se, Sanja', 'Toma Zdravkovic', '4hoRvdkn5iYGwFBFtGODBG'),
      track('A Jesam Te Volio', 'Sejo Kalač', '1tAKnM8R74aMTmzDuVJdgq'),
      track('Za Tobom Lud', 'Relja', '0V1ZqHo5wHtmSWU5b5oW1r'),
      track('Mesec U Vodi', 'Zeljko Samardzic', '5D23HvkZMdNGrM1s2b2t3c'),
      track('Ne daj na nas', 'Pavel', '3EpoJXaxpv5ybMSCas5l8R')
    ]);

    itAutoMatches('The Wombats – Tokyo', '0dt2bECwIUEzWppQLeUqG6', [
      track('Tokyo (Vampires & Wolves)', 'The Wombats', '0dt2bECwIUEzWppQLeUqG6'),
      track('Tokyo (Vampires & Wolves) - This Acoustic Glitch', 'The Wombats', '2uOxbeEtpETnVYRDRsjJMK'),
      track('Moving to New York', 'The Wombats', '7GvkOFkNsM6Exnkyqeajqm'),
      track('Tokyo Drifting', ['Glass Animals', 'Denzel Curry'], '2MA6YoaFF7fnWqkuOAWjUg'),
      track('Aperture', 'Harry Styles', '45Z3m6yazmAi4jZuW0tzW0'),
      track('The Sound Of San Francisco - Progressive Album Mix', 'Global Deejays', '60tsXfCcG6Ljxsr8whOXL5'),
      track('Dancing with Myself', 'Generation X', '1lEhKudlkpBsh6S7JyvvHs'),
      track('Dancing with Myself - 2001 Remaster', ['Billy Idol', 'Generation X'], '3rQfYDjgpRy5LFlClpPQW9')
    ]);

    itDoesNotAutoMatch('Chvrches – Strong Hand', [
      track('Strong Hand - Bonus Track', 'CHVRCHES', '6QRyDxgiNSKYsR8CNlc2fZ'),
      track('Strong Hand - Live At Ancienne Belgique / 2013', 'CHVRCHES', '2mqMlTfMt153TYeLNQYksE'),
      track('Strong', 'London Grammar', '6k1I9gABiasGZiWWAosAEb'),
      track('Streets', 'Kensington', '61ks9qYaFaMxUGpYsl1BCF'),
      track('An End Has a Start', 'Editors', '5jth1c4wa4BythOzap3qOU'),
      track('You’re Gonna Go Far', 'Noah Kahan', '4nHJcUtNSUVjXRnjdP29Bk'),
      track('Intro', 'M83', '7w0FV6ViNDZFy9Mu90sQzl')
    ]);

    itAutoMatches('Macklemore & Ryan Lewis – Can’t Hold Us', '3bidbhpOYeV4knp8AIu8Xn', [
      track('Victory Lap', ['Macklemore & Ryan Lewis', 'Macklemore', 'Ryan Lewis'], '4KMj9aLrNc45H9ETYz7IcE'),
      track('Thrift Shop (feat. Wanz)', ['Macklemore & Ryan Lewis', 'Macklemore', 'Ryan Lewis', 'Wanz'], '7bYZBVrnRfqeaPbhRyEvK3'),
      track('Irish Celebration', ['Macklemore & Ryan Lewis', 'Macklemore', 'Ryan Lewis'], '2rLcR01HB0ScBAsgxX4Z62'),
      track('Can\'t Hold Us (feat. Ray Dalton)', ['Macklemore', 'Ryan Lewis', 'Macklemore & Ryan Lewis', 'Ray Dalton'], '3bidbhpOYeV4knp8AIu8Xn'),
      track('Light Tunnels (feat. Mike Slap)', ['Macklemore & Ryan Lewis', 'Macklemore', 'Ryan Lewis', 'Mike Slap'], '6liGqN48zCba8OPKVu9oDn'),
      track('Can\'t Hold Us - Live From Spotify NYC feat. Ray Dalton', ['Macklemore & Ryan Lewis', 'Ray Dalton'], '4FQDZwcvvXpqpPMquZ6qTV'),
      track('Can\'t Hold Us (made popular by Macklemore & Ryan Lewis) [backing version]', 'Party Tyme', '6yjhQO1aEzChLvCsxZYqtq')
    ]);

    itAutoMatches('Radiohead – Street Spirit', '2QwObYJWyJTiozvs0RI7CF', [
      track('Street Spirit (Fade Out)', 'Radiohead', '2QwObYJWyJTiozvs0RI7CF'),
      track('Creep', 'Radiohead', '70LcF31zb1H0PyJoS1Sx1r'),
      track('Karma Police', 'Radiohead', '63OQupATfueTdZMWTxW03A'),
      track('Talk Show Host', 'Radiohead', '3cMuGOGSaTWbwOurTS4b3Y'),
      track('Exit Music (For A Film)', 'Radiohead', '0z1o5L7HJx562xZSATcIpY'),
      track('On the Border', 'Al Stewart', '4quZUUklzrX8nI4q1jIXHT'),
      track('On the Border - 2001 Remaster', 'Al Stewart', '6GXl3ADX2Lw5JaOSk620j2'),
      track('Fly Like an Eagle', 'Seal', '5eOhVJhGSUVdhVo2LBHHML'),
      track('No L\'s', 'Smino', '12CNybio0Bxean3F3uYugU')
    ]);

    itAutoMatches('PPK – Resurrection', '3Gt5mXx93zbX572QDhPC93', [
      track('Resurrection', ['Tony Garcia', 'PPK'], '3Gt5mXx93zbX572QDhPC93'),
      track('Resurrection - Remix', ['DJ Jenk', 'PPK'], '54QuJThFI9wbRneN8El1av'),
      track('Resurrection', 'Project One', '7IOKoeqoZtAOpya4fABmob'),
      track('ResuRection', 'stillwaitingmom', '6X43pgJl4z1FPXLXWUvVc0'),
      track('PPK Project (Resurrection Remix)', 'Mike C', '7lj48cKfjAb8OpxpSZeEAx'),
      track('ResuRection', ['Paul Oakenfold', 'Planet Perfecto Knights', 'KIMMIC'], '5GzTz8lK093BHzwhKBAtKc'),
      track('ResuRection (Vadim Zhukov Remix)', ['PPK', 'Vadim Zhukov'], '2rwrllOwdwcwWMiGf8tgMR'),
      track('ResuRection (FYH447)', ['Paul Oakenfold', 'PPK', 'KIMMIC'], '6mOLiIaujrNl7srckUwHpR'),
      track('ResuRection - Maurice West Remix', ['Planet Perfecto Knights', 'Maurice West'], '1H1t63Jv0nX7ayhnoLPIiB'),
      track('Reload (Radio Edit)', 'PPK', '2udPXigRI2pKuyLeAfTo3a')
    ]);

    itAutoMatches('Meat Loaf – I’d Lie For You', '0hrh211HEFDbqIpG6znlwQ', [
      track('I\'d Lie For You (And That\'s The Truth)', 'Meat Loaf', '0hrh211HEFDbqIpG6znlwQ'),
      track('I\'d Lie For You (And That\'s The Truth) - Live From The Beacon Theatre, New York, U.S.A./1995', 'Meat Loaf', '7rCxzlGnpXDFxDebO9wYNo'),
      track('(Everything I Do) I Do It For You', 'Bryan Adams', '1Eb90nmqTrxylKFhcUzW8P'),
      track('I\'d Do Anything For Love (But I Won\'t Do That)', 'Meat Loaf', '4UrgDocbHywDZv2f3mBhCq'),
      track('I\'d Do Anything For Love (But I Won\'t Do That) - Single Edit', 'Meat Loaf', '3IuSgREoO5y88HdIcE2Xee'),
      track('#1 Crush - Nellee Hooper Mix', ['Garbage', 'Nellee Hooper'], '6H0OAE0okNGkA29feqkyse'),
      track('No Peace', ['Sam Smith', 'Yebba'], '5ZX1X9Rl4zbx1Wwyn3idVD'),
      track('Him & I (with Halsey)', ['G-Eazy', 'Halsey'], '5k38wzpLb15YgncyWdTZE4')
    ]);

    itAutoMatches('The Script & Will.i.am – Hall of Fame', '7wMq5n8mYSKlQIGECKUgTX', [
      track('Hall of Fame (feat. will.i.am)', ['The Script', 'will.i.am'], '7wMq5n8mYSKlQIGECKUgTX'),
      track('Hall of Fame (feat. will.i.am) - sped up', ['sped up + slowed', 'The Script', 'will.i.am'], '09q25kUOESuDfTbgjcq8CD'),
      track('Hall of Fame', 'The Script', '0FB5ILDICqwK6xj7W1RP9u'),
      track('Breakeven', 'The Script', '285hMzLhJwHVLe9QT9qilk'),
      track('The Man Who Can\'t Be Moved', 'The Script', '3nqqDo8CcCLke3ZoTgiOKf'),
      track('Hallucinate', 'Dua Lipa', '1nYeVF5vIBxMxfPoL0SIWg'),
      track('The Man', 'The Killers', '5aWhs651KYM26HYM16kRdk')
    ]);

    itAutoMatches('30 Seconds to Mars – Attack', '0lHSJ0ZP8uUPnJXhMdGjOK', [
      track('Attack', 'Thirty Seconds To Mars', '0lHSJ0ZP8uUPnJXhMdGjOK'),
      track('Attack - Live', 'Thirty Seconds To Mars', '1qIAuL484Dk7eyDODg9pAF'),
      track('The Kill', 'Thirty Seconds To Mars', '0lP4HYLmvowOKdsQ7CVkuq'),
      track('The Kill (Bury Me)', 'Thirty Seconds To Mars', '1p1nO35bbi4ZlQgjIA4oa4'),
      track('Paralyzed', 'Sueco', '7l4mdOTSYwOayDaHc3s0PV'),
      track('R.E.D.', ['The Halluci Nation', 'Yasiin Bey', 'NARCY', 'Black Bear'], '0E2ydjbrsOYbWFZzexOyYd'),
      track('Price Tag', ['Jessie J', 'B.o.B'], '2fTsFCKRFQ5M0igJgabnLA')
    ]);

    itAutoMatches('Too Many Outs – I Like To Think', '2sW7GXnNRn0qbMJ6bdl6F1', [
      track('I Like to Think', 'Too Many Outs', '2sW7GXnNRn0qbMJ6bdl6F1'),
      track('Too Many People', 'Noshows', '7ppWSmmnD9tXQHhoMQKMNq'),
      track('Too Many Reasons', 'Micah Soulman', '2SxtMHQiLU7LE6IkuLuGLx'),
      track('Too Many Women (feat. kwn)', ['Jordan Adetunji', 'kwn'], '60nXonFosfqr4KpZHm48OH'),
      track('Too Many Birds', 'Bill Callahan', '7ydapdmQ4oivP54X29q7Af'),
      track('Stephanie', 'Nafeesisboujee', '5rc7178sa2YRDlBFBHY0e8'),
      track('Never Let Me Down', ['Kanye West', 'JAŸ-Z', 'J. Ivy'], '34j4OxJxKznBs88cjSL2j9'),
      track('30 For 30 (with Kendrick Lamar)', ['SZA', 'Kendrick Lamar'], '3rXZ1j7QTXphBCavJDBZXz'),
      track('two', 'bbno$', '02qqbVSYkDc6FTClN5gwH5'),
      track('WHY', 'NF', '7rjGZWlqqeEMDrAabwZQhr')
    ]);

    // Not sure if we should keep this test. It is one where the alternatives aren't obviously wrong.
    itAutoMatches('Sigur Rós – Untitled #8', '0juwzpu354078dcKpR5p0w', [
      track('Untitled #8 - Popplagið', 'Sigur Rós', '0juwzpu354078dcKpR5p0w'),
      track('Untitled #8 - 2022 Remaster', 'Sigur Rós', '2zyXyei2jNC0BeaekYUbJx'),
      track('Untitled #8 - Jacobs Studio Sessions', 'Sigur Rós', '4TL9mbCt6FqrBp1OnvqDYi'),
      track('Untitled #1 - Vaka', 'Sigur Rós', '331TLlSwGbVcNKJMkylNbK'),
      track('Untitled #4 - Njósnavélin', 'Sigur Rós', '3fjoFeVDK2ifrZ4yOCwFYC'),
      track('Untitled #3 - Samskeyti', 'Sigur Rós', '1QUiA9aecDOOnf32A9ZrtW'),
      track('Untitled #9 - Smáskifa 1', 'Sigur Rós', '2HwjsEb0xaxURY5gN8X6q5'),
      track('Intro Ella y el muerto - Sigur 8 (Untitled) ÔÇô Sigur Ros', 'Ella y el muerto (Camila Sodi)', '4tkDcVgDG2Zcnr0EhHg4ja'),
      track('Svefn-g-englar', 'Sigur Rós', '07eGxuz8bL6QMsRqEe1Adu')
    ]);

    itAutoMatches('Temples – Colours To Life', '1SrdKbwjC2XOptogQc6luY', [
      track('Colours to Life', 'Temples', '1SrdKbwjC2XOptogQc6luY'),
      track('Colours to Life (Beyond the Wizards Sleeve Reanimation)', ['Temples', 'Beyond The Wizards Sleeve'], '4A7ItS2epRo93BmX2gCAZ2'),
      track('Temple of Light', 'Sat-Chit', '3PY0r7viesWZ5EfDr3lDgP'),
      track('Temple of Compassion', 'Sat-Chit', '26XcgmdHrCEBU9LqcnBA4w'),
      track('Back To Life (feat. Julia Church)', ['Wilkinson', 'Julia Church'], '5zsfgeZ8D7G6aE0FXF0mAZ'),
      track('Hallucination', 'Sissal', '07JJ7J8JhEztiEcczioBws'),
      track('Healing Hands', 'Alan Frew', '2q1rdjOoj4YYHfGL0fgSIG')
    ]);

    itAutoMatches('My Chemical Romance – Welcome To The Black Parade', '5wQnmLuC1W7ATsArWACrgW', [
      track('Welcome to the Black Parade', 'My Chemical Romance', '5wQnmLuC1W7ATsArWACrgW'),
      track('Welcome to the Black Parade - Steve Aoki 10th Anniversary Remix', ['My Chemical Romance', 'Steve Aoki'], '7IftnLLdqUobxlPbZYUWll'),
      track('Teenagers', 'My Chemical Romance', '7j31rVgGX9Q2blT92VBEA0'),
      track('Welcome to the DCC', 'Nothing But Thieves', '1eivMnftGIAIeTDUfTssVX'),
      track('Technicolor Dream', 'My Friend Catie', '4Mn0mNcjY2GpycbCChNLej'),
      track('Emo Boy', 'Ayesha Erotica', '40MskkY7wsFIzhPy19NNTP'),
      track('No Such Thing', 'John Mayer', '6Vecwo7AHst9V2CE3kmwr0')
    ]);

    itAutoMatches('Steve Harley & Cockney Rebel – Sebastian', '2IyzwzJVyBOBmqmW3s8mrb', [
      track('Sebastian', 'Steve Harley & Cockney Rebel', '2IyzwzJVyBOBmqmW3s8mrb'),
      track('Sebastian - Live', 'Steve Harley & Cockney Rebel', '60YR6Pt65QxcupWKt8lmWI'),
      track('Sebastian - 2012 Remaster', 'Steve Harley & Cockney Rebel', '46B0KDDMttNDOu0tvstfmB'),
      track('Sebastian - DJ Edit', 'Steve Harley & Cockney Rebel', '6HRMEMDft2j8Qe9LngYzwF'),
      track('Sebastian', ['Steve Harley', 'Steve Harley & Cockney Rebel'], '7grjejTDy5bA98GSlRl3Op'),
      track('Make Me Smile (Come up and See Me) - 2014 Remaster', ['Steve Harley', 'Steve Harley & Cockney Rebel'], '2dpO3NteNWUDL2S9e0t0Mi'),
      track('Krueger', 'trent', '2UOr4sNBGDvvpqIecJZ8q2'),
      track('Pop\'s a Dirty Word - Demo', 'Mick Terry', '2PNmhiOkSPDoV9RJt6yJDg'),
      track('Pop\'s a Dirty Word', 'Mick Terry', '5JRnVn0PyJfCANSEZJ8o3X')
    ]);

    itAutoMatches('Mumford & Sons – Below My Feet', '7AdnuwqXfe8bKB8Hr8T51e', [
      track('Below My Feet', 'Mumford & Sons', '7AdnuwqXfe8bKB8Hr8T51e'),
      track('Below My Feet - Live from Redrocks, Colorado', 'Mumford & Sons', '2jQ67yZ483zBVVUxsVfLqN'),
      track('Little Lion Man', 'Mumford & Sons', '3GfgC3AawvFSCowb90vpzl'),
      track('On The Way', 'Hollow Coves', '0TvxrH69oDuV4k9NZAvs3l'),
      track('In My Life', 'The Rasmus', '2S1UKV4EaCBll5lJrSXxOz'),
      track('Survive (Subnautica)', 'Divide Music', '4147GrDuO6wn7HQ1PfPyZp'),
      track('4r Da Squaw', 'Isaiah Rashad', '71lyUtIPCMAYjTwwwxy2jW')
    ]);

    itAutoMatches('All Time Low – A Love Like War', '41KusbdnWcB8VUn4Wz0PBy', [
      track('A Love Like War', ['All Time Low', 'Vic Fuentes'], '41KusbdnWcB8VUn4Wz0PBy'),
      track('A Love Like War (Live)', 'All Time Low', '3RAQjGLImQVcgC4RYHaUYk'),
      track('A Love Like War (feat. Vic Fuentes)', ['All Time Low', 'Vic Fuentes'], '0TPF6uW7fhMXJPoBERqTy5'),
      track('A Love Like War', 'Twinkle Twinkle Little Rock Star', '1cq8VnduIt95feftrMBBMW'),
      track('All Time Low', 'Jon Bellion', '1CnPYaKxTVb4LWOtiGOm0m'),
      track('Caramel', 'Sleep Token', '1QrbZhFYlViXd60g130vw1'),
      track('War', 'Kensington', '6mEl7vK6usgdsNm4QFHeEd'),
      track('nuh uh', 'Jades Goudreault', '2tigH2DP65aAzAlyAFNoRZ'),
      track('Mo Money Mo Problems (feat. Diddy & Mase) - 2014 Remaster', ['The Notorious B.I.G.', 'Diddy', 'Mase'], '1Adv59vxt3iVdKhVE6rpFR')
    ]);

    itAutoMatches('Apollo – Dance', '2Uwk3VPYnhP8h7i3TQKPHD', [
      track('Dance - Radio Mix', 'Apollo', '2Uwk3VPYnhP8h7i3TQKPHD'),
      track('Dance', ['Megara vs DJ Lee', 'Andy Judge', 'Apollo'], '1bbnRRCadgjhLPB90nklKj'),
      track('Apollo', 'Space 92', '4jDTMcSXDCBbwUoU2BnzzP'),
      track('Apollo', 'Franky Rizardo', '1uARu4x8LEMUifBIJqdVu6'),
      track('Apollo', ['Hardwell', 'Amba Shepherd'], '7EdxI2Yro4AW2HH3akwqms'),
      track('MONTAGEM APOLLO', 'SCHWVFTY', '2qPj9IVIlNt8N0k7ImG5Eg'),
      track('Apollo 11', ['Matador', 'ARTBAT'], '2vl9yXYJmoKbv72pUIxoue'),
      track('Apollo', 'Charlotte de Witte', '7sNp24ekO02LkwhV7kBh3Z'),
      track('Apollo Road', ['Dash Berlin', 'ATB'], '4XiNFx46PzeUEN03noa6qK'),
      track('Ain\'t Talkin\' \'Bout Dub', 'Apollo 440', '2SgWbfclzWv42aJDXnVGAX')
    ]);

    itAutoMatches('Arcade Fire – Rebellion', '0xOeB16JDbBJBJKSdHbElT', [
      track('Rebellion (Lies)', 'Arcade Fire', '0xOeB16JDbBJBJKSdHbElT'),
      track('Rebellion (Lies) (8-Bit Arcade Fire Emulation)', '8-Bit Arcade', '2D3sEGzNk6hLhmvoKgmggx'),
      track('Ready to Start', 'Arcade Fire', '33X9miK4Xz7pNeVrc9RITG'),
      track('The Suburbs', 'Arcade Fire', '5iItYl3Q6wCnKVfpK1uNVf'),
      track('Diamonds', 'The Boxer Rebellion', '0GLv1X9sA8gqzZs98g1B11'),
      track('Rebellion (Lies)', 'Vitamin String Quartet', '6VwDsNY5gAvWKg9GqMnWzu'),
      track('North Of Richmond (Remix)', ['Chris Webby', 'Oliver Anthony Music'], '3YvBWCpNnIqa3YnCbmbNrs'),
      track('Sucker for Pain (feat. Logic, Ty Dolla $ign & X Ambassadors)', ['Lil Wayne', 'Wiz Khalifa', 'Imagine Dragons', 'Logic', 'Ty Dolla $ign', 'X Ambassadors'], '4aX71c3TYHe9GxPojZ6bkn'),
      track('Sucker for Pain (with Wiz Khalifa, Imagine Dragons, Logic & Ty Dolla $ign feat. X Ambassadors)', ['Lil Wayne', 'Wiz Khalifa', 'Imagine Dragons', 'X Ambassadors', 'Logic', 'Ty Dolla $ign'], '4dASQiO1Eoo3RJvt74FtXB'),
      track('Astronaut In The Ocean (Remix) - feat. G-Eazy & DDG', ['Masked Wolf', 'DDG', 'G-Eazy'], '1NawUUW8GmiRbJ9UkaKGY4')
    ]);

    itAutoMatches('Nahko & Medicine for the People – Love Letters To God', '0t61jS2m26FLL3lD9dk5Ql', [
      track('Love Letters to God', 'Nahko And Medicine For The People', '0t61jS2m26FLL3lD9dk5Ql'),
      track('Love Letters To God - Live at Red Rocks Amphitheater, Morrison, CO, 6/19/2019', 'Nahko And Medicine For The People', '6sDTHb7ZhLLyP8bcTj4cZb'),
      track('Tus Pies (Your Feet) - 10 Year Anniversary Edition', 'Nahko And Medicine For The People', '7fyWGxuhfrcLMRbV0wcWhL'),
      track('Feel', 'FLETCHER', '3adxxXViv1a6kvkAaACCMm'),
      track('Professional Rapper (feat. Snoop Dogg)', ['Lil Dicky', 'Snoop Dogg'], '5TlAXiBCBwiQnIZUAA4Jkg'),
      track('Suti Muje', ['RN-Pro Beatz', 'Hotfire band'], '2rEUdYj4nvENN1Gqtnjzob'),
      track('Survivor\'s Guilt', 'Dave', '7iCjLSD7tHUtBA8bPUoVN9'),
      track('Njang Koo - Special Version', 'RN-Pro Beatz', '0R4NgH3hLqoQD6QuQaedE8'),
      track('Higher', 'Burna Boy', '7fA7mrYaXVDVVGCAV65NRN'),
      track('Real As It Gets', ['Lil Baby', 'EST Gee'], '54eFmMpOaOYfHVB9bbjMIK')
    ]);

    itAutoMatches('Meat Loaf – Objects In The Rear View Mirror May Appear Closer Than They Are', '2QLe0gNkUFKPlxJUauGLwh', [
      track('Objects In The Rear View Mirror May Appear Closer Than They Are', 'Meat Loaf', '2QLe0gNkUFKPlxJUauGLwh'),
      track('Objects In The Rear View Mirror May Appear Closer Than They Are - Edit', 'Meat Loaf', '0goZnZi8SR6XXHkQ4Vn89W'),
      track('Objects In The Rear View Mirror May Appear Closer Than They Are - Live 1993', 'Meat Loaf', '14hqQraND4tZ27lGPsRJlE'),
      track('Objects In The Rear View Mirror May Appear Closer Than They Are - Radio Edit', 'Meat Loaf', '0uIvkgmIiptUsE88we6J4S'),
      track('Objects In The Rear View Mirror May Appear Closer Than They Are - Wild Bomb Mix', 'Meat Loaf', '4LdGZTJRiCPatNGw1bpzBu'),
      track('Rearview Closer Than It Looks', 'Bobby Skyline', '0Q0l33U4lZrfRx2ZUIuQGD'),
      track('Overflow the Borders', ['Black Bear', 'Night Falls'], '4EQEtjcRIQGlDnm0zGmc1k')
    ]);

    itAutoMatches('The Mamas & The Papas – California Dreamin’', '1ZEOIhSn6BKErV59bIgn76', [
      track('California Dreamin\'', 'The Mamas & The Papas', '1ZEOIhSn6BKErV59bIgn76'),
      track('California Dreamin\' - Single Version', 'The Mamas & The Papas', '4s6LhHAV5SEsOV0lC2tjvJ'),
      track('California Dreamin\'', 'Sia', '1QzIPFcpaapCryW5wRsgU4'),
      track('California Dreamin\'', 'The Beach Boys', '2UZCTcfF0y4jiVdQkPcmO7'),
      track('California Dreamin\' - Remastered 2007', 'The Beach Boys', '4MHzXgBy7hexDe2Bto11hP'),
      track('Monday, Monday - Single Version', 'The Mamas & The Papas', '3EFb1qDgIqf9MegIryKtDj'),
      track('Dream A Little Dream Of Me', 'The Mamas & The Papas', '27hhIs2fp6w06N5zx4Eaa5')
    ]);

    itAutoMatches('N.E.R.D. feat Lee Harvey & Vita – Lapdance', '6FuAe03bP2SQT4TCDKhuGx', [
      track('Lapdance', ['N.E.R.D', 'Vita', 'Lee Harvey'], '6FuAe03bP2SQT4TCDKhuGx'),
      track('The Way She Dances', 'N.E.R.D', '27Kzoh7F9NK9fYRYDKJIqG'),
      track('BLOODY BARS - DRILLUMINAZIONE (feat. Charlie KDM, Hell Raton & Lazza)', ['BLOODY VINYL', 'Slait', 'MILES', 'thasup', 'Low Kidd', 'Charlie KDM', 'Hell Raton', 'Lazza'], '0e16hLAkJH4yP5lNBMcken'),
      track('Provider', 'N.E.R.D', '0W0eLsePQodsOy3IwY04BS'),
      track('She Wants To Move', 'N.E.R.D', '2JPJoasAPRqCPUwy2qyMph'),
      track('Run To The Sun', 'N.E.R.D', '4Bjwyj8KM85xblkSt5A24j'),
      track('Bobby James', 'N.E.R.D', '6XYJ6RL7GkuDtLxXnsAPkd'),
      track('You Know What', 'N.E.R.D', '40YQDJrYZFIP24QVfUi9Ar')
    ]);

    itAutoMatches('Wildstylez feat. Niels Geusebroek – Year Of Summer', '3iKcDwqwMf6O547uQcyjaO', [
      track('Year Of Summer', ['Wildstylez', 'Niels Geusebroek'], '3iKcDwqwMf6O547uQcyjaO'),
      track('Year of Summer - DJ Mix', ['Wildstylez', 'Niels Geusebroek'], '1L4Od3JXb2Atldz9nhChHR'),
      track('Year Of Summer - Radio Edit', ['Wildstylez', 'Niels Geusebroek'], '5U7NscpqQub6inkiFZApNG'),
      track('NotYourAverageFlight', 'Doyen', '0xaVu0orECeTblGrnBqVeC'),
      track('Summer Long', ['DRIEL', 'XAJE'], '05mt1wI7YtKaOa9cnyEXpV'),
      track('LOVE (a secret visitor) : Commentary (with parkjiyoon)', ['So!YoON!', 'parkjiyoon'], '3576aoW8cZSheoBfh3cnFF'),
      track('The Interview', 'The Smashing Pumpkins', '1vd6RAAMj6SZyXFKtsW2jl'),
      track('Rocky Mountain Low', 'Ken Dravis', '5TCMF13DTUFtOdYR07vxj1'),
      track('SNEAK OUT STORY', 'H-Dom', '2duNJMAdGsZZ1PJWxzRrd1')
    ]);

    itAutoMatches('The Carpenters – Sing', '386bIxJPFIr5pVuVQTZIOm', [
      track('Sing', 'Carpenters', '386bIxJPFIr5pVuVQTZIOm'),
      track('Yesterday Once More', 'Carpenters', '3wM6RTAnF7IQpMFd7b9ZcL'),
      track('Top Of The World', 'Carpenters', '1Ehdm1PDlKrdfyBsjwEvd1'),
      track('Top Of The World - Single Mix', 'Carpenters', '3b2XUZqJ9qQFKmnKyn7p9F'),
      track('(They Long To Be) Close To You', 'Carpenters', '2kyVQg00pphEufGT59M2XH'),
      track('Sing', 'Travis', '4yA2SM7XCLkSgkBUSoZb5S'),
      track('Dance with Somebody - Radio Version', 'Mando Diao', '28qkNp9shSV8AQrBwxZf48'),
      track('Lullaby', ['R3HAB', 'Mike Williams'], '3Ed9ksLxR0cZbRzad7FNqh')
    ]);

    itAutoMatches('Within Temptation – What Have You Done', '2OHeJR6Cfvm42512gonFRh', [
      track('What Have You Done (feat. Keith Caputo)', ['Within Temptation', 'Keith Caputo'], '2OHeJR6Cfvm42512gonFRh'),
      track('What Have You Done (feat. Keith Caputo) - Rock Mix', ['Within Temptation', 'Keith Caputo'], '10W6QARyLV19nCXdpUCsO7'),
      track('Angels', 'Within Temptation', '4QWLhGVitrCCysR3ugX9Xw'),
      track('Faster', 'Within Temptation', '4XBtYPGMAYJkuJu2w4pmYl'),
      track('Ice Queen', 'Within Temptation', '140cSu65JC8smYw53nPP0q'),
      track('Church (feat. Teddy Verseti)', ['T-Pain', 'Teddy Verseti'], '7cyBdix7HId2onf99SrJBV'),
      track('Monkey Wrench', 'Foo Fighters', '44wXefe8WB9Fd6xwtmAwbR'),
      track('Pink Pony Club', 'Chappell Roan', '0PCQjOXi4yORRcXHrOAxaK')
    ]);

    itAutoMatches('Lange feat. Skye – Drifting Away', '66guDzeVBd01tuzKpRZksz', [
      track('Drifting Away', ['Lange', 'Skye'], '66guDzeVBd01tuzKpRZksz'),
      track('Drifting Away - Extended Mix', ['Lange', 'Skye'], '3wrU8jrAQxpNweNryOCkS6'),
      track('Drifting Away - Dan Harrison Remix', ['Lange', 'Skye', 'Dan Harrison'], '4sfuJSPBjBWYh6eRbJhVL1'),
      track('Lang', ['Lil Kleine', 'Yssi SB'], '7kxUp5JrJKWg0bgxvunnI9'),
      track('Waves', 'Daisy Eyes', '7szll12uxsWnnBbeFpUSQh'),
      track('Attitude', ['Joey Casey', 'Ridiculous1000'], '57DACTlzftdTzPtuxEpSRu'),
      track('Globe Cypher', ['Connor Price', 'Killa', 'SIRI', 'Bens', 'Kazuo', 'K.Keed', 'Zensery', 'Lucca DL'], '3wzAF00pXS1NCYmUWjYnKH'),
      track('Part 2', 'NASA', '3tG8U0jL0UXli4jKc6LwEd'),
      track('Circles', 'TURNYM', '3EcWJ9ax5mAp8NlolkIbfx'),
      track('Gave you all my love : Commentary (with Kwangjae Jeon)', ['So!YoON!', 'Kwangjae Jeon'], '2R6DryiugDPjZPoZ5Fgulg')
    ]);

    itAutoMatches('Riva feat. Dannii Minogue – Who Do You Love Now?', '35PEVVj0HGwvjIYuBZWvVr', [
      track('Who Do You Love Now? (Stringer)', ['Riva', 'Dannii Minogue'], '35PEVVj0HGwvjIYuBZWvVr'),
      track('Who Do You Love Now? (feat. Dannii Minogue) - Riva\'s Bora Bora Club Mix', ['Riva', 'Dannii Minogue'], '1MjLHYU0L3cvzzXcplQQg8'),
      track('Who Do You Love Now (Stringer) - Vocal Mix', ['Riva', 'Dannii Minogue', 'Chocolate Puma'], '5Us0gVY9v5gIm8AdGF7MCA'),
      track('Who Do You Love Now (Stringer) - Extended Vocal Mix', ['Riva', 'Dannii Minogue', 'Chocolate Puma'], '24Qe8WgbjauCfSvvrJhGvq'),
      track('Who Do You Love?', ['YG', 'Drake'], '1zPRY6WFfQhk1QqEeGSXiT'),
      track('Who Do You Love - R3HAB Remix', ['The Chainsmokers', '5 Seconds of Summer', 'R3HAB'], '5QkVPG2Hf3MmAarireF6lh'),
      track('High and Sober', 'BOII', '1NIwakVnDVUP4ZLwjoduCN'),
      track('Come Undone', 'My Darkest Days', '4qR4J8QRTeN0W8Rp5nVdzi'),
      track('Come Undone', 'Duran Duran', '0yfNXxlyXdmP0ue1iJijx1'),
      track('It Feels Much Better', ['Riva Starr', 'Soul Speech', 'Harry Stone'], '2YJZrP7foi3hTnuVGbEsnp')
    ]);

    itAutoMatches('M83 – Go!', '18mNRyfNGQvVfwTJo27sNR', [
      track('Go!', ['M83', 'MAI LAN'], '18mNRyfNGQvVfwTJo27sNR'),
      track('Outro', 'M83', '1s9i7W8zx7Nxx78MUIsvjV'),
      track('StarWaves', ['M83', 'Joseph Trapanese'], '0v9Ud7xm4hiYEFu5nKcYzC'),
      track('Wait', 'M83', '01Q3OyB05mLgH01fpdAMPP'),
      track('Midnight City', 'M83', '6GyFP1nfCDB8lbD2bG0Hq9'),
      track('Solitude - Felsmann + Tiley Reinterpretation', ['M83', 'Felsmann + Tiley'], '6RK3IsiUW6YaSMEodbO4tk'),
      track('The Climb (Gospel Choir)', 'Sunny Ray', '3d1uMHeWPdKwIOn3aNWdrl'),
      track('My Tears Are Becoming a Sea', 'M83', '08wnOyN1wyMaNrup3m353f'),
      track('Go', ['The Chemical Brothers', 'Q-Tip'], '2cNjgoSh1TBHFQIhfzRJUE'),
      track('Someone Somewhere (In Summertime)', 'Simple Minds', '4wJq75UFYtFYbMO2KBBnlw')
    ]);

    itAutoMatches('Major Lazer & DJ Snake – Lean On', '2YWjW3wwQIBLNhxWKBQd16', [
      track('Lean On', ['Major Lazer', 'DJ Snake', 'MØ'], '2YWjW3wwQIBLNhxWKBQd16'),
      track('Lean On', ['Major Lazer', 'MØ', 'DJ Snake'], '4UKJUbcuStnnxLeJmVJsSc'),
      track('Lean On (feat. MØ & DJ Snake)', ['Major Lazer', 'MØ', 'DJ Snake'], '2e7s0oEzUoJtDSPtYJuVvD'),
      track('Lean On - Robin Schulz Remix', ['Major Lazer', 'DJ Snake', 'Robin Schulz', 'MØ'], '30e6h7IdWoXn07yADlkNF5'),
      track('Light It Up', ['Major Lazer', 'Nyla', 'Fuse ODG'], '1pjvlYOMIg1NhGQbM6iwrY'),
      track('Lean On - Sped Up (Major Lazer x MØ x DJ Snake)', ['Major Lazer', 'Sped-O', 'spedup trends'], '10ceOeLMSbiqrFfaBRWnPy'),
      track('Watch Out For This (Bumaye)', ['Major Lazer', 'Busy Signal', 'FS Green', 'The Flexican'], '5StvAhgmgCOpCPHHNfS8bx')
    ]);

    itAutoMatches('Ava Max – Kings & Queens', '7a53HqqArd4b9NF4XAmlbI', [
      track('Kings & Queens', 'Ava Max', '7a53HqqArd4b9NF4XAmlbI'),
      track('Kings & Queens - MOTi Remix', ['Ava Max', 'MOTi'], '31LLpb0q1phhd3sRxIsdLz'),
      track('Kings & Queens - James Carter Remix', ['Ava Max', 'James Carter'], '3x0YvIZ6eAWKZZAaDFtZB5'),
      track('Angels', ['Amaru Love', 'Breana Marin'], '1rSTUqK87rhqspfIGu7zaB'),
      track('Kings & Queens, Pt. 2 (feat. Lauv & Saweetie)', ['Ava Max', 'LAUV', 'Saweetie'], '5rB5mfeFCkUI3nkHQMMZ3K'),
      track('New Charlotte', 'DuRu Tha King', '1sx46qHT5YiZtQLcc5aVNx')
    ]);

    itAutoMatches('Alan Walker – Ignite', '1jLsirPDkUS2g4gnkYua58', [
      track('Ignite', ['Alan Walker', 'Julie Bergan', 'K-391', 'SEUNGRI'], '1jLsirPDkUS2g4gnkYua58'),
      track('Ignite (feat. K-391) - Instrumental', ['Alan Walker', 'K-391'], '31odF1W48AxUG6nPEHQXyg'),
      track('Faded', 'Alan Walker', '698ItKASDavgwZ3WjaWjtz'),
      track('Darkside', ['Alan Walker', 'Au/Ra', 'Tomine Harket'], '6SRWhUJcD2YKahCwHavz3X'),
      track('Ignite - Ahrix Remix', ['K-391', 'Alan Walker', 'Julie Bergan', 'SEUNGRI', 'Ahrix'], '4BkOTjyeSbQw1LkFhKu1gL'),
      track('Ignite - Different Heaven Remix', ['K-391', 'Alan Walker', 'Julie Bergan', 'SEUNGRI', 'Different Heaven'], '0qsAtFxboLqqvSWhUr9uy3'),
      track('Autodrive', 'Alan Alexeo', '5rYk7HaX0EErP1qD16T4RY'),
      track('Take Me Back', ['Guts', 'Leron Thomas', 'Tanya Morgan'], '6iWxjMVYkNjHqnxDlQvzfH'),
      track('LIKE ME', 'MGEE', '6BuB8dzxIclK31T7z2ppLg'),
      track('Playboy Tensions IX', 'Obey Little Luck', '5ocX0es7ipR7xyhOeLxI9x')
    ]);

    itAutoMatches('Simon & Garfunkel – The Sound of Silence', '3YfS47QufnLDFA71FUsgCM', [
      track('The Sound of Silence', 'Simon & Garfunkel', '3YfS47QufnLDFA71FUsgCM'),
      track('The Sounds of Silence', 'Simon & Garfunkel', '3CepTOU9Y7FezTt0CF3lCw'),
      track('The Sound of Silence - Acoustic Version', 'Simon & Garfunkel', '5y788ya4NvwhBznoDIcXwK'),
      track('The Sound of Silence', 'Disturbed', '1Cj2vqUwlJVG27gJrun92y'),
      track('The Sound of Silence - CYRIL Remix', ['Disturbed', 'CYRIL'], '1LY3GhF0zxIVgbYEQjCbUO'),
      track('The Sounds of Silence - Live at Central Park, New York, NY - September 19, 1981', 'Simon & Garfunkel', '5jZVO2BKMYigxIGVgfRvs3'),
      track('Bridge Over Troubled Water', 'Simon & Garfunkel', '6l8EbYRtQMgKOyc1gcDHF9'),
      track('Music On The Radio', 'Empire Of The Sun', '6FNpgPgWAxrtH6uYwDAOmU'),
      track('This Is What It Feels Like', ['Armin van Buuren', 'Trevor Guthrie'], '5GjnIpUlLGEIYk052ISOw9'),
      track('Tell It To My Heart', ['MEDUZA', 'Hozier'], '46nvQpUDsxpS08UTFOeKTA')
    ]);

    itAutoMatches('Auri – Night 13', '2GxISQd2cNYGqZKm5b8tJJ', [
      track('Night 13', ['Auri', 'Johanna Kurkela'], '2GxISQd2cNYGqZKm5b8tJJ'),
      track('Echoes from the Parallel Night', 'Solmara', '5nfpTsFbbJ6at7hXeN50jY'),
      track('aurum', 'net', '1KLCKnjbK20vdCqZwQJ4hP'),
      track('Auridon Sunrise', 'Brad Derrick', '16C6Fn3NZPGx3BKJNdIGmU'),
      track('A Boy Travelling With His Mother', 'Auri', '0JjisBXVR2TYBCH15dnHle'),
      track('Serenade No. 13 in G Major, K. 525 "A Little Night Music": I. Allegro', ['Wolfgang Amadeus Mozart', 'Orchestre De Chambre De Toulouse', 'Louis Auriacombe'], '7wgxsbTiXNpABYvT9y1uLn'),
      track('Serenade No. 13 in G Major, K. 525 "A Little Night Music": III. Menuetto. Allegretto - Trio', ['Wolfgang Amadeus Mozart', 'Orchestre De Chambre De Toulouse', 'Louis Auriacombe'], '7cJXMLy3mN0sfV3DfzDBd3'),
      track('SICKO MODE', 'Travis Scott', '2xLMifQCjDGFmkHkpNLD9h'),
      track('Man Of His Word', 'Kashus Culpepper', '6vSkfVfd6tY0h6tDa1lw9A')
    ]);

    itAutoMatches('Enrique Iglesias – Subeme La Radio', '7nKBxz47S9SD79N086fuhn', [
      track('SUBEME LA RADIO', ['Enrique Iglesias', 'Descemer Bueno', 'Zion & Lennox'], '7nKBxz47S9SD79N086fuhn'),
      track('SUBEME LA RADIO REMIX', ['Enrique Iglesias', 'Sean Paul'], '5XeSiH1cHcz1Lqzxj4qk5P'),
      track('SUBEME LA RADIO REMIX', ['Enrique Iglesias', 'Sean Paul', 'Matt Terry'], '140ZXTyy731tJdisnQ5ulm'),
      track('SUBEME LA RADIO PORTUGUESE REMIX (feat. Descemer Bueno, Anselmo Ralph, Zé Felipe & Ender Thomas)', ['Enrique Iglesias', 'Descemer Bueno', 'Anselmo Ralph', 'Zé Felipe', 'Ender Thomas'], '6sJuq2WEWCYL7wbV1gWHOO'),
      track('Tamo Bien', ['Enrique Iglesias', 'Pitbull', 'IAmChino'], '72RjC359lcwhf1cON9ppls'),
      track('DUELE EL CORAZON', ['Enrique Iglesias', 'Wisin'], '5adqS3stLaSPAEOszOnpXG'),
      track('Bailando - Spanish Version', ['Enrique Iglesias', 'Descemer Bueno', 'Gente De Zona'], '6PSKhwo0mVcOdjUOhVJd5p'),
      track('I Like It', ['Enrique Iglesias', 'Pitbull'], '7HacCTm33hZYYN8DXpCYuG'),
      track('No Me Digas Que No', ['Enrique Iglesias', 'Wisin', 'Yandel'], '2A2U1QnZHSPriVFOxS6oZM')
    ]);

    itAutoMatches('Skrillex – First Of The Year', '5i7fZq3chLyCHo3VeB6goD', [
      track('First of the Year (Equinox)', 'Skrillex', '5i7fZq3chLyCHo3VeB6goD'),
      track('First of the Year', 'Vitamin String Quartet', '3KqmzG7ur82MjCAt1j4Ioz'),
      track('First Of The Year, My Name Is Skrillex, Get Up!', ['Summer Swee-Singh', 'Miren Edelstein'], '5DBTClC0qkQqWLfaDTZhAN'),
      track('Bangarang (feat. Sirah)', ['Skrillex', 'Sirah'], '6VRhkROS2SZHGlp0pxndbJ'),
      track('First of the Year (Equinox) [Karaoke Version With Guide Melody] - Originally Performed By Skrillex', 'La-Le-Lu', '1npPpbFRs64DCcshf7hWoj'),
      track('Just a Friend', 'Biz Markie', '1MQCTOWVfy4PcuBXkBsHVB'),
      track('The Glen - Levi Heron Edit', 'Levi Heron', '7K2DFO1NYMtBdNP6vNlhWI'),
      track('The Glen', 'Beluga Lagoon', '3xEl8iU2MuTUlnPMxRBPS1'),
      track('No Introduction', 'Central Cee', '0zgcef8wT0O27OI2vPGnB9'),
      track('90mph', ['JBEE', 'Sillage'], '6uT2TsDrCrXue7ROEfNeGN')
    ]);

    itAutoMatches('The Fever 333 – Made An America', '0Q6AD7e7d9tpN1dXL4qh5P', [
      track('Made An America', 'FEVER 333', '0Q6AD7e7d9tpN1dXL4qh5P'),
      track('The Fever', 'Foreign Figures', '0iCxluZpaWzhZuLeDDfOz8'),
      track('Fever Dream', ['Nightcraft', 'Strixter', 'ÆLINN'], '2EU5PmkX9pyLygHBDQyYDx'),
      track('Walking In My Shoes', 'FEVER 333', '7mqJvR6BgtGbOssGZAfdaP'),
      track('(The First Stone) Changes [feat. Yelawolf]', ['FEVER 333', 'Yelawolf'], '1kc3xvHmhXqXg4le5uYqLM'),
      track('Hustler\'s Ambition', '50 Cent', '0dZlON0G0od05O549PikZU'),
      track('Bang Bang Bang - lil yappa/minus b remix', ['lil yappa', 'BBpanzu'], '32zlBVsIzi9XbvX2a4H0xf'),
      track('Bang Bang Bang', 'BBpanzu', '4Pjht5dwS2BDK7klpDtGaO'),
      track('Not Guilty', 'SkyDxddy', '4sJSMXIqIrOfkXDSOeMJFn')
    ]);

    itAutoMatches('Within Temptation – Dangerous', '3BYtn1zK991rGwWo5TW9e6', [
      track('Dangerous (feat. Howard Jones)', ['Within Temptation', 'Howard Jones'], '3BYtn1zK991rGwWo5TW9e6'),
      track('Angels', 'Within Temptation', '4QWLhGVitrCCysR3ugX9Xw'),
      track('A Dangerous Mind', 'Within Temptation', '58HW5SrzfLyjKPYPRjAKwr'),
      track('Faster', 'Within Temptation', '4XBtYPGMAYJkuJu2w4pmYl'),
      track('Dangerous (feat. Howard Jones) - Hydra Live in Concert', ['Within Temptation', 'Howard Jones'], '2MMp8mqkjb0ZYH170MOE8t'),
      track('Ice Queen', 'Within Temptation', '140cSu65JC8smYw53nPP0q'),
      track('Temptation (feat. Poppy Baskcomb)', ['Jess Bays', 'Poppy Baskcomb'], '3fvsxmytTns1ApIWBqfANZ'),
      track('Run This Town', ['JAŸ-Z', 'Rihanna', 'Kanye West'], '7LR85XLWw2yXqKBSI5brbG'),
      track('Moth to a Flame', 'Delain', '4Oct1rxJ3hQtkgXxT3ktCA')
    ]);

    itAutoMatches('Andras Kallay-Saunders – Running', '3gdZA8Jct5VBFUmugE6hic', [
      track('Running', 'Kállay Saunders', '3gdZA8Jct5VBFUmugE6hic'),
      track('Running - Karaoke Version', 'Kállay Saunders', '4AN0a492FPsWqcKTbIM2nm'),
      track('Running', 'Parallel Voices', '5bukDgowMSuWxKrHNcP7kt'),
      track('Andreaen Sand Dunes', 'Drexciya', '5vcCF1Q328JhaZj4MS6XqO'),
      track('Dancing Shoes - Danny Better & Victor Brown Remix', ['Dj Junior', 'Kállay Saunders'], '5jIKjYd5rB6cou4lQfhgoZ'),
      track('Running', ['Calu', 'Asphodelle'], '4O0MtRBfTVLo4BoY1lAfEO'),
      track('Running Miles', 'Anderholm', '6DX2g9Ib1lAiY5sNfF3Dzn'),
      track('Pulse & Silence', 'Andra Kasal', '7ooX4UMtAzVquPHEoK0n4R')
    ]);

    itDoesNotAutoMatch('Pink Floyd – Another Brick In The Wall', [
      track('Another Brick in the Wall, Pt. 2', 'Pink Floyd', '4gMgiXfqyzZLMhsksGmbQV'),
      track('Another Brick in the Wall, Pt. 1', 'Pink Floyd', '7K6xMPtAjTuLPNlJMLf5bS'),
      track('Another Brick in the Wall, Pt. 3', 'Pink Floyd', '5A7eooPKJHtr0UJmatjH4a'),
      track('Comfortably Numb', 'Pink Floyd', '5HNCy40Ni5BZJFw1TKzRsC'),
      track('Wish You Were Here', 'Pink Floyd', '6mFkJmJqdDVQ1REhVfGgd1'),
      track('Proper Education - Radio Edit', ['Eric Prydz', 'Floyd'], '06Vw2ZOhalTwEw4PhoGRSX'),
      track('MOON MUSiC', ['Coldplay', 'Jon Hopkins'], '41FNZsY7w7KaTQ2bjxdR6w'),
      track('Summer of Luv (feat. Unknown Mortal Orchestra)', ['Portugal. The Man', 'Unknown Mortal Orchestra'], '2PKbC4uFUY1tcBABpGZ8GQ')
    ]);

    itAutoMatches('My Chemical Romance – Na Na Na', '5BB0Jzw60KyfSTyjJqtely', [
      track('Na Na Na (Na Na Na Na Na Na Na Na Na)', 'My Chemical Romance', '5BB0Jzw60KyfSTyjJqtely'),
      track('Teenagers', 'My Chemical Romance', '7j31rVgGX9Q2blT92VBEA0'),
      track('Yalla FG', ['MetaBoy', 'Samsara'], '7cW3kzMwgWKRF9AuYp57w2'),
      track('Whatcha Doing', 'Dua Lipa', '6bAkr9wkQyPM4IDrP4tuwR'),
      track('Me Conviene', 'Ciento Once 111', '1FOGrzNt8jfWnqGQ7z7qdB'),
      track('S&M', 'Rihanna', '7ySUcLPVX7KudhnmNcgY2D'),
      track('Freed From Desire', 'Gala', '3EpbZE2fBvFb1nhaGCCFQS'),
      track('Drops of Jupiter (Tell Me)', 'Train', '2hKdd3qO7cWr2Jo0Bcs0MA'),
      track('Papa poule', 'JOYBØY', '08i6qIAybMxPrNacbWXXKz')
    ]);

    itAutoMatches('Alan Parsons Project – Eye in the Sky', '2sIbHjfJ3nbMXNz4w03fWv', [
      track('Eye In The Sky', 'The Alan Parsons Project', '2sIbHjfJ3nbMXNz4w03fWv'),
      track('Sirius', 'The Alan Parsons Project', '0hSs4vOZo1OkRiAOoLafrT'),
      track('Old and Wise', 'The Alan Parsons Project', '5qdlMWYpCtJFsHey3rXYms'),
      track('Mammagamma', 'The Alan Parsons Project', '3g2wrzcMmo2iSSw5Q9vTN6'),
      track('Children of the Moon', 'The Alan Parsons Project', '1TaVPXzhKeDFMZgOaHybgG'),
      track('Don\'t Answer Me (2024 Remaster)', 'The Alan Parsons Project', '7HnaNZdT8Gel6mw725AuLR'),
      track('Kingslayer (feat. BABYMETAL)', ['Bring Me The Horizon', 'BABYMETAL'], '7CAbF0By0Fpnbiu6Xn5ZF7'),
      track('Diamonds', 'Rihanna', '65YsalQBmQCzIPaay72CzQ'),
      track('Dr. Greenthumb - Radio Edit', 'Cypress Hill', '4rgtUNM0q1TR10qkyMEo3B')
    ]);

    itAutoMatches('Calvin Harris – Feels', '6BaCraQ9xeLYg4Sb9TBT2X', [
      track('Feel So Close - Radio Edit', 'Calvin Harris', '1gihuPhrLraKYrJMAEONyc'),
      track('Summer', 'Calvin Harris', '6YUTL4dYpB9xZO5qExPf05'),
      track('Blessings', ['Calvin Harris', 'Clementine Douglas'], '78nx0HDJIFD5xDq2L5420Z'),
      track('Feels (feat. Pharrell Williams, Katy Perry & Big Sean)', ['Calvin Harris', 'Pharrell Williams', 'Katy Perry', 'Big Sean'], '6BaCraQ9xeLYg4Sb9TBT2X'),
      track('Feels (feat. Pharrell Williams, Katy Perry & Big Sean)', ['Calvin Harris', 'Pharrell Williams', 'Katy Perry', 'Big Sean', 'Funk Wav'], '5bcTCxgc7xVfSaMV3RuVke'),
      track('Reminds Me Of You', ['LMFAO', 'Calvin Harris'], '67rng1rPBbNy6yZAaNO3u5'),
      track('Feels (made popular by Calvin Harris ft. Pharrell Williams, Katy Perry & Big Sean) [vocal version]', 'Party Tyme', '3dhtEcgvuyjJ4TqtU3i08w'),
      track('Calvin Klein', 'Rosemary Joaquin', '2LDJWwvrHq6F31z6HL78gH'),
      track('1990s', 'Ren', '5B8WqSmp2XR2L08VEhZ8b6')
    ]);

    itAutoMatches('IIO – Rapture', '0OSAJEA0ekX6pr2nuiPzX7', [
      track('Rapture (feat.Nadia Ali)', ['iio', 'Nadia Ali'], '0OSAJEA0ekX6pr2nuiPzX7'),
      track('Rapture (Riva Remix) [feat. Nadia Ali]', ['iio', 'Nadia Ali'], '7Jf9tCso7rOigCPXeNJ3tm'),
      track('Rapture (Original Extended Mix) [feat. Nadia Ali]', ['iio', 'Nadia Ali'], '222yiPDioYChvKBEBqVYyq'),
      track('Rapture', 'DE SOFFER', '2Y7mPbyhhZucNtI6Vrt0vZ'),
      track('Rapture', ['JPT3R', 'Nick Giardino', 'Calypsø', 'Afro Queen'], '0gB4dLKem1Y2yBA6OIoDTU'),
      track('Rapture (Armin Van Burren Remix Remastered - Made Radio Edit) [feat. Nadia Ali]', ['iio', 'Nadia Ali'], '4RQGig0Vhr4GXmqfklCCyK'),
      track('Rapture - Avicii New Generation Radio Edit', ['Nadia Ali', 'Avicii'], '5Sr4SdwPmLhDuKMs8QviLe'),
      track('The Rapture Pt.III', ['&ME', 'Black Coffee', 'Keinemusik'], '200DiJQhDi69nkGXOrrJgn'),
      track('The Rapture Pt.III We Are One - Remix', 'dj AT', '73UPBzVyVuSGt8C1Sd1jDj'),
      track('Bac Kapuyt Achqert x The Rapture Pt. III (Carlos Afro House Mashup)', ['DJ CARLOS', 'Brunette', 'Black Coffee', '&ME'], '00jUiEayBfGcaIK5Md0b1V')
    ]);

    itDoesNotAutoMatch('Nelly Furtado – On The Radio', [
      track('**** On The Radio (Remember The Days)', 'Nelly Furtado', '6UX5HtPQ72j5N3PnULiIoE'),
      track('Promiscuous', ['Nelly Furtado', 'Timbaland'], '2gam98EZKrF9XuOkU13ApN'),
      track('Shit On The Radio (Remember The Days)', 'Nelly Furtado', '7G5Fepm6qOfG75W43Gwp1q'),
      track('Say It Right', 'Nelly Furtado', '2aI21FnmY7TJVKeMaoQZ0t'),
      track('I\'m Like A Bird', 'Nelly Furtado', '2aGw77pZqli064JiPuXYRi'),
      track('Satellite Signal', 'MIND', '3pMuJthG4asb1jPrP2Llnu'),
      track('Reminder', 'The Weeknd', '37F0uwRSrdzkBiuj0D5UHI'),
      track('3005', 'Childish Gambino', '2X6b7zLdIxCejd6GqVcQ9M'),
      track('Bad Girls', 'M.I.A.', '6nzXkCBOhb2mxctNihOqbb')
    ]);

    itAutoMatches('Linkin Park – Rebellion', '3zZ009FB8sc8JghwVrbLFq', [
      track('Rebellion - Instrumental', 'Linkin Park', '5NqrrghKiFxeFKnE5pHJHJ'),
      track('Rebellion (feat. Daron Malakian)', ['Linkin Park', 'Daron Malakian'], '3zZ009FB8sc8JghwVrbLFq'),
      track('Numb', 'Linkin Park', '2nLtzopw4rPReszdYBJU6h'),
      track('The Emptiness Machine', 'Linkin Park', '1EDPVGbyPKJPeGqATwXZvN'),
      track('Enth E Nd (Kutmasta Kurt Reanimation) [feat. Motion Man]', ['Linkin Park', 'Motion Man'], '4fYnWAimYBRNgNgTLYbXAI'),
      track('Gayageum Rebellion', ['Linking Audio', 'Ji-eun Park'], '1dNxxDYbhei93cqriOdPYo'),
      track('Good Goodbye (feat. Pusha T and Stormzy)', ['Linkin Park', 'Pusha T', 'Stormzy'], '650OeHTLxZAQmb4aEbGmaA'),
      track('IO, ME ED ALTRI GUAI', 'Rose Villain', '3yHaLLFfK7VgthM73xcMRj'),
      track('Wenn du tanzt', 'Von Wegen Lisbeth', '0G7vexduCvboPyIGjJXQIC')
    ]);

    itAutoMatches('TheFatRat feat. Laura Brehm – We’ll Meet Again', '7nDkXyN86D6iszJdl0r8YB', [
      track('We\'ll Meet Again', ['TheFatRat', 'Laura Brehm'], '7nDkXyN86D6iszJdl0r8YB'),
      track('The Calling', ['TheFatRat', 'Laura Brehm'], '6YzMhlI36vzyDYvhjiVf54'),
      track('Monody', ['TheFatRat', 'Laura Brehm'], '2PLMiHYcVixnjsG8QPiHFo'),
      track('The Calling - Da Tweekaz Remix', ['TheFatRat', 'Laura Brehm'], '09Tba3tLGhoSMIpodVWKId'),
      track('Meant To Be', ['Rebelution', 'Jacob Hemphill'], '14wlLa3Hy1rm5ZFIBZa0dy'),
      track('Fuck Up - feat. Askim Soul Children', 'Sirius', '4FBfpWeComJ5ACwufHfyY5'),
      track('Summer Long', ['DRIEL', 'XAJE'], '05mt1wI7YtKaOa9cnyEXpV'),
      track('As Lights Fall', 'Alan Parsons', '59Nv0s5k8TL5aa0xFXkwyl')
    ]);

    itAutoMatches('Meat Loaf – Rock & Roll Dreams Come Through', '4YaoFW42YXgVr5U1UzIANs', [
      track('Rock And Roll Dreams Come Through', 'Meat Loaf', '4YaoFW42YXgVr5U1UzIANs'),
      track('Rock And Roll Dreams Come Through - Radio Edit', 'Meat Loaf', '6vLd1UPizFEDzlrA57N4FA'),
      track('Rock And Roll Dreams Come Through - Live from Ontario', 'Meat Loaf', '5todzcHEL2GqTy9Mg5mPAR'),
      track('Rock and Roll Dreams Come Through', 'Jim Steinman', '5Y7JlzuX1CtyEl8qf58qeU'),
      track('Rock And Roll Dreams Come Through - Live From The United States / 1994', 'Meat Loaf', '1kqeQLpXUiPiuuZiuTE3Ew'),
      track('Paradise By the Dashboard Light', 'Meat Loaf', '2g7gviEeJr6pyxO7G35EWQ'),
      track('Gypsy Road', 'Cinderella', '2F8Glc7r4mHHSCEegD4Ju1'),
      track('Pass The Nirvana', 'Pierce The Veil', '7I93h9I0RUqt1ci3Bfa290'),
      track('I\'d Do Anything For Love (But I Won\'t Do That) - Single Edit', 'Meat Loaf', '3IuSgREoO5y88HdIcE2Xee')
    ]);

    itAutoMatches('Cat Stevens – Morning Has Broken', '7lJcPqSxbSyDE4bLnXeoqr', [
      track('Morning Has Broken', 'Yusuf / Cat Stevens', '7lJcPqSxbSyDE4bLnXeoqr'),
      track('Morning Has Broken - Remastered 2021', 'Yusuf / Cat Stevens', '5y8d8RHvxb0KiTa9Nq0xWp'),
      track('Father And Son', 'Yusuf / Cat Stevens', '476V2d6iA2tWXgQboKmTtA'),
      track('Wild World', 'Yusuf / Cat Stevens', '7mjSHL2Eb0kAwiKbvNNyD9'),
      track('Soulmates', 'Fran Quintana', '4kIPFifJbR2AW59XBACUz2'),
      track('Joy', 'Bastille', '6Tt1P5CLUrl59oSOTVxON0')
    ]);

    itAutoMatches('Linkin Park – Heavy', '104buTcnP2AsxqB7U1FIZ4', [
      track('Heavy Is the Crown', 'Linkin Park', '2HBBM75Xv3o2Mqdyh1NcM0'),
      track('Heavy (feat. Kiiara)', ['Linkin Park', 'Kiiara'], '104buTcnP2AsxqB7U1FIZ4'),
      track('Numb', 'Linkin Park', '2nLtzopw4rPReszdYBJU6h'),
      track('Two Faced', 'Linkin Park', '6i5qhmmF9UNUBRyrPSGn4m'),
      track('The Emptiness Machine', 'Linkin Park', '1EDPVGbyPKJPeGqATwXZvN'),
      track('Good Goodbye (feat. Pusha T and Stormzy)', ['Linkin Park', 'Pusha T', 'Stormzy'], '650OeHTLxZAQmb4aEbGmaA'),
      track('Enough (Miami)', 'Cardi B', '4XqBLxDaEdlqkHlSlb1Rzq'),
      track('Wenn du tanzt', 'Von Wegen Lisbeth', '0G7vexduCvboPyIGjJXQIC')
    ]);

    itAutoMatches('The Vaccines – Wreckin’ Bar', '1K5vb3Yu4F8yMaHggtdpDY', [
      track('Wreckin\' Bar - Demo', 'The Vaccines', '2wDLFMcTg7vW3OfBMsbVkk'),
      track('Wreckin\' Bar (Ra Ra Ra)', 'The Vaccines', '1K5vb3Yu4F8yMaHggtdpDY'),
      track('Wreckin\' Bar (Ra Ra Ra) - Live in Brighton', 'The Vaccines', '7rDc7KSapCM9LnKS3oPbm0'),
      track('If You Wanna', 'The Vaccines', '6Ca3uEAuun3HusTUiIXKs1'),
      track('Sangria', 'Blake Shelton', '0p1HtkrNYxv0iDfEKwXSTp'),
      track('Welcome to the DCC', 'Nothing But Thieves', '1eivMnftGIAIeTDUfTssVX'),
      track('Iedereen Is Van De Wereld', 'The Scene', '2BiPF7tOVgriZaMCHnSC54'),
      track('Bug Powder Dust - Live At Dragonfest', ['Bomb The Bass', 'Dbreathe', 'Andy North'], '0wvmEbmV5LPwRz0Bdccdep'),
      track('Hell\'s Belles', 'Zolita', '4Ni3RfbRDVzC6KWxzcWPLi')
    ]);

    itAutoMatches('Lana del Rey – Young and Beautiful', '2nMeu6UenVvwUktBCpLMK9', [
      track('Young And Beautiful', 'Lana Del Rey', '2nMeu6UenVvwUktBCpLMK9'),
      track('Summertime Sadness', 'Lana Del Rey', '33CeM8NI7tfrNgciVOFMoo'),
      track('Video Games', 'Lana Del Rey', '7FDHI71Z3IInsEKuUn7Df8'),
      track('Catch My Breath', 'Alex Warren', '4aha3sFO6kTx0Jq4Fp5b3y'),
      track('Mean girls', 'Charli xcx', '1qKCO2Tocwg8CbepJ9uDtd'),
      track('Drop Dead Gorgeous', 'Princess Nokia', '2VeR22PlXdnn7F9VhxUTSR')
    ]);

    itAutoMatches('Michel Fugain – Une Belle Histoire', '5oxKrYimzs8AZp8lkoar6V', [
      track('Une Belle Histoire - Live', 'Michel Fugain', '1ft0gzJt1N6sjxzEU5G3EO'),
      track('Une belle histoire - Love Michel Fugain', ['Michel Fugain', 'Arcadian', 'Claudio Capéo', 'Corneille', 'Anaïs Delva', 'Olivier Dion', 'Mickaël Dos Santos', 'Patrick Fiori', 'Florent Mothe', 'Damien Sargue'], '0cp8gS8208teQeHQ8d7akt'),
      track('Une belle histoire', 'Caravelli', '5k7uzLsKsYU45P3Y6V9cMV'),
      track('Une Belle Histoire', 'Eva sur Seine', '654RprVvr0L8l6wm7XEHci'),
      track('Une belle histoire', 'Michel Fugain & Le Big Bazar', '5oxKrYimzs8AZp8lkoar6V'),
      track('Le Printemps', ['Michel Fugain', 'Le Big Bazar'], '5yYKAqjzycLuJvbDjGWysB'),
      track('Une Belle Histoire/Een Mooi Verhaal', ['Paul de Leeuw', 'G.J. Alderliefste'], '7skWuMUzBE46evVYEAh36T'),
      track('CIEL', 'GIMS', '78FNSZkI1968KTtyf2s315')
    ]);

    itAutoMatches('X Japan – I.V.', '1bGgiCE2E8RaP35iJEAkr0', [
      track('I.V.', 'X JAPAN', '1bGgiCE2E8RaP35iJEAkr0'),
      track('X - Remaster', 'X JAPAN', '6aMOnyPDHIrnT0mepiaLeR'),
      track('X - Short Version - Live', 'X JAPAN', '0pGK45Gk3BbHiYJ7TJt28I'),
      track('In the Palace - Agitato', 'Yoshihisa Hirano', '6jc699F2pFPUH4qLgB42t5'),
      track('In the Palace - Lamentoso', 'Yoshihisa Hirano', '4fY0gYvW2IJNkdlkd8y1Zm'),
      track('IRIS OUT (Reze ver.)', 'Kikai Udon', '7jQTzECqNSHJyQ7ePAiMzc'),
      track('THat Part - Black Hippy Remix', 'ScHoolboy Q', '5sqHFfmw7MMc1L85BN8802'),
      track('ss', 'Ken Carson', '26QJuQfM8PVAWkIm1JRyqq'),
      track('Bump Heads', ['Eminem', 'Tony Yayo', '50 Cent', 'Lloyd Banks'], '4OYGHze5MiMkgozardIRxU'),
      track('Snake Tongue', 'Zawezo', '6CMzw03R00TTYFdW1CZe6s')
    ]);

    itAutoMatches('Maan & Goldband – Stiekem', '0kINWIY7BToJACjRzIOqsz', [
      track('Stiekem', ['Maan', 'Goldband'], '0kINWIY7BToJACjRzIOqsz'),
      track('Noodgeval', 'Goldband', '2LcmbuYX7tyR4DWy3b273L'),
      track('Stiekem Gedanst', 'Toontje Lager', '7hIR9M1Gz5COo3UQGfM0sy'),
      track('Stiekem wil ik DJ zijn', ['Gotu Jim', 'Faberyayo'], '6NYMd9sNlm1kFCI6oxb1Rb'),
      track('Echte Liefde Is Te Koop', 'Samuel Welten', '7tW2Md8xOwnKPIYhCqPiU4')
    ]);

    itAutoMatches('Bløf – Zoutelande', '6aAJY5FYW0TMLsUe2T7x4p', [
      track('Zoutelande', 'BLØF', '6aAJY5FYW0TMLsUe2T7x4p'),
      track('Zoutelande - Live op CAS 2017', 'BLØF', '0PeckNl9t4TmTdo1yxjvLI'),
      track('Zoutelande (Live op Concert at SEA 2023)', 'BLØF', '0r9NmUxxEXjiH2gBas6182'),
      track('Zoutelande (feat. Geike)', ['BLØF', 'Geike'], '0le8EcVp4x1JjMhwRKIOVi'),
      track('Dansen Aan Zee', 'BLØF', '6hC1xBNYMVK4acdnEXaZVD'),
      track('Aan De Kust', 'BLØF', '1gnfCs2KFqdhrSjpy0kkpV'),
      track('Wat Zou Je Doen?', 'BLØF', '5hKPBa1YOiER774WMHR36p')
    ]);

    itAutoMatches('Snelle – Reünie', '2ytVeoA2wq5lgVHBWQIMoa', [
      track('Reünie', 'Snelle', '2ytVeoA2wq5lgVHBWQIMoa'),
      track('Reünie - Outsiders Remix', ['Snelle', 'Outsiders'], '7u97e8PYHdOHKk1NejO0n0'),
      track('In De Schuur', ['Snelle', 'Ronnie Flex'], '3JKvw6CYS4uJepKNZzl0Nm'),
      track('Smoorverliefd', 'Snelle', '433a3I7BdVl2RUTKycgEzK'),
      track('Blijven Slapen', ['Snelle', 'Maan'], '5UKN8Siz4jJvMsEInb9PSG'),
      track('Energie', ['Ronnie Flex', 'Frenna'], '1riPE3NCV1OBmSXqpYiMJY'),
      track('Laat Het Licht Aan', 'Snelle', '3m7590UqY1VXNtF6axoWj1'),
      track('Niemand', ['Ronnie Flex', 'Mr. Polska'], '62DBa9iwXVgod4bPtmg4xe'),
      track('CD van mij', ['Ronnie Flex', 'Acda en de Munnik'], '764EyTlmlcqOlf1FyBPYif')
    ]);

    itAutoMatches('Wes – Alane', '7BQ5aGUuTHfkxPjLupviR4', [
      track('Alane - Radio Version', 'Wes', '1Tb6iLIWF9nrHv36vD8Lwb'),
      track('Alane - Todd Terry\'s Radio Mix', 'Wes', '39efJ7FpyszrwpuqrlgX0K'),
      track('Alane', ['Robin Schulz', 'Wes'], '7BQ5aGUuTHfkxPjLupviR4'),
      track('Amalia', 'Wesly Bronkhorst', '3c28vYkrzU9nVqvJfbaSiu'),
      track('Ik Drink Rosé', 'Wesly Bronkhorst', '44GKO40UgFA0cTOWeSLyPz'),
      track('De Avond Is Van Ons', ['Wesly Bronkhorst', 'Billy Dans', 'LA$$A', 'Poke', 'Brace'], '2misMDi4t5KGdaeLKXOryx'),
      track('Jerusalema (feat. Nomcebo Zikode)', ['Master KG', 'Nomcebo Zikode'], '2MlOUXmcofMackX3bxfSwi'),
      track('Down Under', 'Men At Work', '3ZZq9396zv8pcn5GYVhxUi'),
      track('Lambada - Original Version 1989', 'Kaoma', '6xepovPqjvrkEw9Y5AMmTm')
    ]);

    itAutoMatches('The Haunted Youth – In My Head', '6ppjs6gQ1N67aE5ydwwr2u', [
      track('in my head', 'The Haunted Youth', '6ppjs6gQ1N67aE5ydwwr2u'),
      track('in my head - early version', 'The Haunted Youth', '3ZncCTx20jDGVCY5qNhYfd'),
      track('Broken', 'The Haunted Youth', '3EJ7h1f0Nvvnpt1mRNCcOz'),
      track('Monster', 'STARSET', '0criiQKIY1hyU0lRbVhZ8L'),
      track('Self Portrait', 'Kyle Chatham', '0VP2cAY7XFnRnvezMBDrlS'),
      track('Young, Gifted And Black', 'Nina Simone', '21QPlVscNywh7gSkgkr15A'),
      track('It\'s Just A Temporary Goodbye', 'Luke Frees', '7yOpYr1qJCE4gHHpkhkwFh'),
      track('Fall Back Down', ['PALASTIC', 'James French'], '6wQaKs1COnCnqPIsIKsccx'),
      track('die first', 'Nessa Barrett', '3TfDUStpnEVIlsNlgcKQgJ')
    ]);

    itAutoMatches('BoA – Every Heart', '13BsjsiCIKWOiFZzT0GZ7K', [
      track('Every Heart-ミンナノキモチ-', 'BoA', '13BsjsiCIKWOiFZzT0GZ7K'),
      track('Every Morning', 'Edd', '472s6GK8J7YnTkgFuTAsxb'),
      track('Every Breath You Take', 'The Police', '2DMMTy6a4iXZUEywM7KCxu'),
      track('Twilight', 'bôa', '6d67Xv8ms2noA8wWFLiPDN'),
      track('Little Numbers', 'BOY', '2q6Na4axOEIe46qufv98G3'),
      track('Counting Stars', 'OneRepublic', '2tpWsVSb9UEmDRxAl1zhX1'),
      track('bring your love (to the light)', 'Noah Henderson', '2JYuCiKDCsqfkkVNcghpvq')
    ]);

    itAutoMatches('The Overslept – Little Miss Has-Been', '4ZLVXoR5n0GPO14edQyPxo', [
      track('Little Miss Has-Been', 'The Overslept', '4ZLVXoR5n0GPO14edQyPxo'),
      track('OVERLAST', ['DIKKE BAAP', 'BLURREDMOVEMENT'], '3dpDInU0OfY3hgZIIF8Ldq'),
      track('Seventeen', 'MARINA', '7ees95rN2dQT95yZdtWkzE'),
      track('Overrated', ['Spiady', 'Pat B'], '3PvE8GS9EeiXU2qwaiFvb7'),
      track('The Big Race', 'Pocoyo English', '53QnvqlNIUeQIZ3k5ukRXd'),
      track('Rivers and Roads', 'The Head And The Heart', '1Ae9EtPyWZcTCinDMsRVuU'),
      track('Overrated', 'Fried By Fluoride', '6WuFZ0M2CUKKTztzatz5mO'),
      track('All That She Wants', 'Ace of Base', '6kWJvPfC4DgUpRsXKNa9z9'),
      track('She Is Got the Black Sheep Blues', 'Dead Bronco', '4nva2ZGuuGqijVe1dUhYtJ'),
      track('F64', 'Ed Sheeran', '5DFi6D7SrYHRIgZbY5MqqE')
    ]);

    itAutoMatches('Nightwish – The Islander', '7DCLfDduecRwxLkcLUY2kQ', [
      track('The Islander', 'Nightwish', '7DCLfDduecRwxLkcLUY2kQ'),
      track('The Islander (Live) - Made in Hong Kong', 'Nightwish', '1SQOO1rNrFvRRNe2HZW2Is'),
      track('The Islander', 'The Navigators', '70gLjUwgKLdrZGmnbs5ZZt'),
      track('Nemo', 'Nightwish', '1RNwniZkJqdw9LMkkyynjx'),
      track('Islander', 'Derina Harvey Band', '00KjOnBUtMikTM3d1E1uk3'),
      track('Furious Anger', ['Shyheim', 'Big L'], '4t8lU7Br9vJ6zTlo3XHMjR'),
      track('Ice Queen', 'Within Temptation', '140cSu65JC8smYw53nPP0q'),
      track('Takin Ova', ['Diaz', 'Opaque', 'N-Light-N', 'Karma', 'Father Blanco', 'Tech-Rock', 'Tommy Tee', 'Warlocks'], '6rlgziqEE7WWmYjpq1W4UD')
    ]);

    itAutoMatches('Twarres – Wer Bisto', '5Xca9Le7973k7m9EorIZUs', [
      track('Wêr Bisto', 'Twarres', '5Xca9Le7973k7m9EorIZUs'),
      track('We\'re Alone', 'Twarres', '3CEJFkkmnw2HGxMi7YJieJ'),
      track('She Couldn\'t Laugh', 'Twarres', '6NTpnbaW5JsD3AZn7vfONa'),
      track('This Is How It Is', 'Twarres', '1FlXNtffKJj1WkDv1effRN'),
      track('Onderweg', 'Abel', '1nduf8eirAAiVLXoC1C7cz'),
      track('I Would Stay', 'Krezip', '3GZFKiGVYv3SBQ6PLf3JgF'),
      track('Opp Sokkebalje', ['Sample Text', 'Súdwest Shankers'], '5Se170bTgkiAucwwHSCTPH')
    ]);

    itAutoMatches('Bløf – Aan de Kust', '1gnfCs2KFqdhrSjpy0kkpV', [
      track('Aan De Kust', 'BLØF', '1gnfCs2KFqdhrSjpy0kkpV'),
      track('Aan De Kust - Live From The Nighttrain, Netherlands / 1998', 'BLØF', '3QNcM2MwPBLQh1nNo73U9k'),
      track('Zoutelande (feat. Geike)', ['BLØF', 'Geike'], '0le8EcVp4x1JjMhwRKIOVi'),
      track('Dansen Aan Zee', 'BLØF', '6hC1xBNYMVK4acdnEXaZVD'),
      track('8 Minuten', 'Lijpe', '4zrPhDPG4J7twaA09v1vht'),
      track('Het Land Van', ['Lange Frans', 'Baas B'], '0wMAsL98TGuI6eWUEocd1O'),
      track('Do Or Die', ['Jonna Fraser', 'Broederliefde'], '2Y63yg1Lgdp96IoiZIvjKz')
    ]);

    itAutoMatches('Sera – Head Held High', '60sCCPmAff8HfYWpaXQQ9e', [
      track('Head Held High', 'SERA', '60sCCPmAff8HfYWpaXQQ9e'),
      track('Head Held High - Acoustic', 'SERA', '7zognYHwgpDhbx00OsIspn'),
      track('Je Draagt Het Niet Alleen', 'SERA', '2RLEGHSBc8YaSckqet41Tf'),
      track('Only Us', 'SERA', '4hsitJwVkpy8b7wDRzhVel'),
      track('The Climb', 'Miley Cyrus', '5x5JM1BSB6vollcIzDocqT'),
      track('Daddy Lessons', 'Beyoncé', '71OvX5NNLrmz7rpq1ANTQn')
    ]);

    itAutoMatches('Marija Serifovic – Molitva', '3qC3JSTCiedBhYm2oN1axx', [
      track('Molitva', 'Marija Šerifović', '3qC3JSTCiedBhYm2oN1axx'),
      track('Molitva - Serbian Version', 'Marija Šerifović', '1ue71r2sNUvl4LSqvgVVcZ'),
      track('Molitva (ESC) - Serbian Version', 'Marija Šerifović', '0DDZoIXfwsqUjCXJHomP1G'),
      track('More Pelina', 'Marija Šerifović', '1nZc4T5BupiWUs8gvebJ38'),
      track('Jedan Dobar Razlog', 'Marija Šerifović', '32aCWRT4DhGOEyxk3iI4Gg')
    ]);

    itAutoMatches('Elton John – Can You Feel The Love Tonight', '32RxZnEk5KyWUTZR4azxbD', [
      track('Can You Feel The Love Tonight - Remastered', 'Elton John', '6s1KHEalfzcHpOK56RV2rt'),
      track('Can You Feel the Love Tonight - End Title', 'Elton John', '32RxZnEk5KyWUTZR4azxbD'),
      track('Your Song', 'Elton John', '38zsOOcu31XbbYj9BIPUF1'),
      track('Circle of Life', 'Elton John', '5LFzj73ZwSep0377OQj4bp'),
      track('Elton John', '257ers', '7no08DYQiszXBT5bLYxSb7'),
      track('The One', 'Kylie Minogue', '3JSagDafesQBzEAKoPBez5'),
      track('This Is Love', ['will.i.am', 'Eva Simons'], '7IohFKIwrb75c4XaqX7WWo'),
      track('Dusk Till Dawn (feat. Sia) - Radio Edit', ['ZAYN', 'Sia'], '3e7sxremeOE3wTySiOhGiP'),
      track('Price Tag - Sped Up', ['Jessie J', 'B.o.B', 'Speed Radio', 'Kuya Magik'], '7wBOjV4TIq2YzPFDc3mFmA')
    ]);

    itDoesNotAutoMatch('PPK – Resurrection', [
      track('Resurrection - Remix', ['DJ Jenk', 'PPK'], '54QuJThFI9wbRneN8El1av'),
      track('Resurrection', 'Project One', '7IOKoeqoZtAOpya4fABmob'),
      track('ResuRection', 'stillwaitingmom', '6X43pgJl4z1FPXLXWUvVc0'),
      track('PPK Project (Resurrection Remix)', 'Mike C', '7lj48cKfjAb8OpxpSZeEAx'),
      track('ResuRection', ['Paul Oakenfold', 'Planet Perfecto Knights', 'KIMMIC'], '5GzTz8lK093BHzwhKBAtKc'),
      track('ResuRection (Vadim Zhukov Remix)', ['PPK', 'Vadim Zhukov'], '2rwrllOwdwcwWMiGf8tgMR'),
      track('ResuRection (FYH447)', ['Paul Oakenfold', 'PPK', 'KIMMIC'], '6mOLiIaujrNl7srckUwHpR'),
      track('ResuRection - Maurice West Remix', ['Planet Perfecto Knights', 'Maurice West'], '1H1t63Jv0nX7ayhnoLPIiB'),
      track('Reload (Radio Edit)', 'PPK', '2udPXigRI2pKuyLeAfTo3a')
    ]);

    itDoesNotAutoMatch('Linkin Park – Heavy', [
      track('Heavy Is the Crown', 'Linkin Park', '2HBBM75Xv3o2Mqdyh1NcM0'),
      track('Numb', 'Linkin Park', '2nLtzopw4rPReszdYBJU6h'),
      track('Two Faced', 'Linkin Park', '6i5qhmmF9UNUBRyrPSGn4m'),
      track('The Emptiness Machine', 'Linkin Park', '1EDPVGbyPKJPeGqATwXZvN'),
      track('Good Goodbye (feat. Pusha T and Stormzy)', ['Linkin Park', 'Pusha T', 'Stormzy'], '650OeHTLxZAQmb4aEbGmaA'),
      track('Enough (Miami)', 'Cardi B', '4XqBLxDaEdlqkHlSlb1Rzq'),
      track('Wenn du tanzt', 'Von Wegen Lisbeth', '0G7vexduCvboPyIGjJXQIC')
    ]);

    itDoesNotAutoMatch('The Vaccines – Wreckin’ Bar', [
      track('Wreckin\' Bar - Demo', 'The Vaccines', '2wDLFMcTg7vW3OfBMsbVkk'),
      track('Wreckin\' Bar (Ra Ra Ra) - Live in Brighton', 'The Vaccines', '7rDc7KSapCM9LnKS3oPbm0'),
      track('If You Wanna', 'The Vaccines', '6Ca3uEAuun3HusTUiIXKs1'),
      track('Sangria', 'Blake Shelton', '0p1HtkrNYxv0iDfEKwXSTp'),
      track('Welcome to the DCC', 'Nothing But Thieves', '1eivMnftGIAIeTDUfTssVX'),
      track('Iedereen Is Van De Wereld', 'The Scene', '2BiPF7tOVgriZaMCHnSC54'),
      track('Bug Powder Dust - Live At Dragonfest', ['Bomb The Bass', 'Dbreathe', 'Andy North'], '0wvmEbmV5LPwRz0Bdccdep'),
      track('Hell\'s Belles', 'Zolita', '4Ni3RfbRDVzC6KWxzcWPLi')
    ]);

    itDoesNotAutoMatch('Porcupine Tree – Arriving Somewhere But Not Here', [
      track('Arriving Somewhere but Not Here - Live', 'Porcupine Tree', '7H54HiOLX6dsQruHmwd7aS'),
      track('Arriving Somewhere But Not Here - 2017 Remaster', 'Porcupine Tree', '6HODkZg8Jm7kG8sk8zXyfn'),
      track('Lazarus', 'Porcupine Tree', '4xnztDfQLOzEBi5yxKAkhM'),
      track('Trains - 2017 Remaster', 'Porcupine Tree', '5bO7kXCc21MOj5MOeiBioU'),
      track('You’re Never Over', 'Eminem', '1v54pVfqtSC7KbTu2C2pnM'),
      track('It All Means Nothing (You\'re Not Here Now)', ['Krezip', 'Danny Vera'], '1dRzBmvoqrvae5m9xBpnK4'),
      track('Show Yourself', ['Idina Menzel', 'Evan Rachel Wood'], '50WeOnXhM1H7AZEeIDoWfZ'),
      track('Take Me to Church', 'Sinéad O\'Connor', '6JTxcKyKE5LUOv918ll0NE')
    ]);

    itDoesNotAutoMatch('Porcupine Tree – Trains', [
      track('Trains - 2017 Remaster', 'Porcupine Tree', '5bO7kXCc21MOj5MOeiBioU'),
      track('Trains - CLOSURE/CONTINUATION.LIVE', 'Porcupine Tree', '5WHUbDQYwPQiwWmOixEbs5'),
      track('Lazarus', 'Porcupine Tree', '4xnztDfQLOzEBi5yxKAkhM'),
      track('Arriving Somewhere But Not Here - 2017 Remaster', 'Porcupine Tree', '6HODkZg8Jm7kG8sk8zXyfn'),
      track('Winter Warz', ['Ghostface Killah', 'Masta Killa', 'Reakwon', 'Cappadonna', 'U-God'], '0iCWDU1S3hjQphZcD0UfIE'),
      track('A Better Tomorrow', 'Wu-Tang Clan', '3JJU9BP2zRFdXpVA7r0gby'),
      track('A Better Tomorrow (feat. Inspectah Deck, Masta Killa, U-God, RZA & Method Man)', ['Wu-Tang Clan', 'Inspectah Deck', 'Masta Killa', 'U-God', 'RZA', 'Method Man'], '1OB7p2ulZT8Z8qkY5akeZB')
    ]);

    itDoesNotAutoMatch('Michel Fugain – Une Belle Histoire', [
      track('Une Belle Histoire - Live', 'Michel Fugain', '1ft0gzJt1N6sjxzEU5G3EO'),
      track('Une belle histoire - Love Michel Fugain', ['Michel Fugain', 'Arcadian', 'Claudio Capéo', 'Corneille', 'Anaïs Delva', 'Olivier Dion', 'Mickaël Dos Santos', 'Patrick Fiori', 'Florent Mothe', 'Damien Sargue'], '0cp8gS8208teQeHQ8d7akt'),
      track('Une belle histoire', 'Caravelli', '5k7uzLsKsYU45P3Y6V9cMV'),
      track('Une Belle Histoire', 'Eva sur Seine', '654RprVvr0L8l6wm7XEHci'),
      track('Le Printemps', ['Michel Fugain', 'Le Big Bazar'], '5yYKAqjzycLuJvbDjGWysB'),
      track('Une Belle Histoire/Een Mooi Verhaal', ['Paul de Leeuw', 'G.J. Alderliefste'], '7skWuMUzBE46evVYEAh36T'),
      track('CIEL', 'GIMS', '78FNSZkI1968KTtyf2s315')
    ]);

    itDoesNotAutoMatch('Deep Purple – Child in Time', [
      track('Child in Time - Edit', 'Deep Purple', '6VzJR0TLF99OybJMybL8b2'),
      track('Child in Time - 1995 Remaster', 'Deep Purple', '573Z2Dty5epeNgKsgoDOlr'),
      track('Purple Rain', 'Prince', '1uvyZBs4IZYRebHIB1747m'),
      track('Smoke On The Water - Remastered 2012', 'Deep Purple', '5MMnwYs0hIxkENRsbkWJ2G'),
      track('PURPLE RAIN (FEAT. FUTURE & METRO BOOMIN)', ['Don Toliver', 'Future', 'Metro Boomin'], '7i8ncEfBk3s0w5YoG43SV9'),
      track('Linger - SiriusXM Session', 'Royel Otis', '2dono2Koz7DEvGwxUsmMLq'),
      track('Stairway to Heaven - Remaster', 'Led Zeppelin', '5CQ30WqJwcep0pYcV4AMNc'),
      track('JEANS STRAPPATI', 'Lamars', '3gI8gamMlq0oKzZ1tegoTs'),
      track('Take It Back', 'Toddla T', '2phQHT9AGWCzCoujB6k7l7')
    ]);

    itDoesNotAutoMatch('The Overslept – Stolen Car', [
      track('Stolen Car - Acoustic', 'The Overslept', '7duMz9Y5kSAA7kPp1ExcPg'),
      track('Stolen Car', 'Beth Orton', '4QFO5fgejhz2tu8ZmlDjzw'),
      track('Perkys Calling', 'Future', '05nB8pRwwbKA2fsKK1nOyE'),
      track('Euphoria', 'Eagulls', '38YdkQvpds9ER45CcsUDfw'),
      track('No Way Out', 'Vítek Jeníček', '2rfEM7EAzRXJ8JAA2KsJs0'),
      track('Wolf Like Me', 'TV On The Radio', '6Zgd7SomLTZkL1WPh4CUnV'),
      track('Let\'s Do It (feat. Playboi Carti & Skooly)', ['Lil Baby', 'Playboi Carti', 'Skooly'], '7bhMeTchpDsG69wNmAZgzN'),
      track('Cut Up My Food (So I Can Eat)', 'Petal In The Pool', '7JvfuJ9zDMiQgZxLCCbM2d')
    ]);

    itDoesNotAutoMatch('Bowling for Soup – Turbulence', [
      track('Turbulence - Acoustic', 'Bowling For Soup', '5Nnwo2CfMF1zjnznNbnqoI'),
      track('1985', 'Bowling For Soup', '5oQcOu1omDykbIPSdSQQNJ'),
      track('I\'m Gay', 'Bowling For Soup', '0VV88Mpi8nzLH0Kqk0F7Io'),
      track('Turbulence (made popular by Bowling For Soup) [vocal version]', 'Party Tyme', '5iprx3R0qZ1iCiCAPSFcIT'),
      track('AWOKENFROMTHESLUMBERTHATHASISOLATEDME', 'bavi breesh', '1SAqUC82i8FhOQ8kSJZnQM'),
      track('Tribunal', 'Sisan', '0tmgypyNX71mxL6BEtkdFC'),
      track('The Anthem', 'Good Charlotte', '0BRHnOFm6sjxN1i9LJrUDu')
    ]);

    itDoesNotAutoMatch('Nightwish – The Poet and the Pendulum', [
      track('The Poet and the Pendulum - Remastered', 'Nightwish', '0pWCBrfY1aR05gxIXUVlAe'),
      track('The Poet and the Pendulum - Live, at Wembley, 2015', 'Nightwish', '7gsiJYgcfS6hM17z4TlSpN'),
      track('Nemo', 'Nightwish', '1RNwniZkJqdw9LMkkyynjx'),
      track('Ghost Love Score - Live, at Wacken, 2013', 'Nightwish', '6Paon2GSO2btqO6qmS6hSE'),
      track('Unseen World', 'Chelsea Wolfe', '7veAqCQq9ko7ywIVoDNJuL'),
      track('Use Somebody', 'Kings of Leon', '7D04SIiYAZq6Kpc4qFhBKY'),
      track('Use Somebody', 'Isaac Hale', '3XXaCFZD3dcik18uJYs9fA'),
      track('Use Somebody - Recorded at Spotify Studios NYC', 'Shawn Mendes', '5My4LtZW8JQJoKFDWodqIt')
    ]);

    itDoesNotAutoMatch('Muse – Uprising', [
      track('Uprising - Live at Rome Olympic Stadium', 'Muse', '3fM1dfdFwNoCuenLcovLXB'),
      track('Uprising - Does It Offend You Yeah Mix', ['Muse', 'Does It Offend You', 'Yeah?'], '2wxIlhdQempN5uDsaJS0c9'),
      track('Starlight', 'Muse', '3skn2lauGk7Dx6bVIt5DVj'),
      track('Psycho', 'Muse', '383QXk8nb2YrARMUwDdjQS'),
      track('Plug in Baby', 'Muse', '2UKARCqDrhkYDoVR4FN5Wi'),
      track('Knights of Cydonia', 'Muse', '7ouMYWpwJ422jRcDASZB7P'),
      track('Time is Running Out', 'Muse', '0EdMqiKs9LKXhspeQhl4RZ'),
      track('Supermassive Black Hole', 'Muse', '3lPr8ghNDBLc2uZovNyLs9')
    ]);

    itDoesNotAutoMatch('HAEVN – Trade It For The Night', [
      track('Trade It For The Night - Single Version', 'HAEVN', '3bmNVAndgjLeQVx5YsL4TM'),
      track('Trade it for the Night - Symphonic Version', ['HAEVN', 'Neco Novellas'], '5s5Nqv8ziDXoiOgFZcAF2v'),
      track('Trade it for the Night - Acoustic Version', ['HAEVN', 'Neco Novellas'], '6rRRpQjOiXvR70uYxmPcJz'),
      track('Trade it for the Night - Live in Carré', ['HAEVN', 'Neco Novellas'], '5yNEBsad93iAR4OD2HOk3a'),
      track('Here With Me', 'DRAMA', '526W1GLtLsmwoCPbfMFPkm'),
      track('what it means to be a girl', 'EMELINE', '6H6M3RdPVYAURu9oCimO2z'),
      track('Sequoia', 'PÆRISH', '6VPhuhPsapwZIU2EP6QceW')
    ]);

    itDoesNotAutoMatch('Sera – Head Held High', [
      track('Head Held High - Acoustic', 'SERA', '7zognYHwgpDhbx00OsIspn'),
      track('Je Draagt Het Niet Alleen', 'SERA', '2RLEGHSBc8YaSckqet41Tf'),
      track('Only Us', 'SERA', '4hsitJwVkpy8b7wDRzhVel'),
      track('The Climb', 'Miley Cyrus', '5x5JM1BSB6vollcIzDocqT'),
      track('Daddy Lessons', 'Beyoncé', '71OvX5NNLrmz7rpq1ANTQn')
    ]);

    itDoesNotAutoMatch('Queensrÿche – Silent Lucidity', [
      track('Silent Lucidity - Remastered 2003', 'Queensrÿche', '6OSyCAmXT4Gkd3OQ2aPOaF'),
      track('Silent Lucidity - Remastered 2000', 'Queensrÿche', '5EcQ53R86rMZ5WnfbVvQEh'),
      track('Silent Lucidity - Live at Moore Theatre, Seattle, WA July 2001', 'Queensrÿche', '3Izv9XJKB4fVuwB9CP7Q6M'),
      track('Ecstasy of Divinity', 'Erik Fredriksen', '15KHCv4iUnbcCnQlu8Tyzw'),
      track('Ruthless Queen', 'Kayak', '14HPLWSrRNhSfxCswERQbw')
    ]);

    itDoesNotAutoMatch('Marc Korn feat. Chelsea Field – Touch the Sky', [
      track('Dive into the Sunset', ['Marc Korn', 'Semitoo', 'Michael Roman'], '1cbu7DH8IWhcHJv2SAIyeQ'),
      track('Hypnotized', ['Marc Korn', 'Semitoo', 'HEAD & HEART'], '0mv7BsTgziLitF2B7xxgfy'),
      track('Chéri', ['Marc Korn', 'Semitoo'], '0btxWEiRhSeHpKLalhaJv2'),
      track('No More Lies', ['Marc Korn', 'Semitoo'], '3GFgRR94n4LDvz6i1uVvNw'),
      track('Call Me Back', ['Marc Korn', 'Semitoo', 'Michael Roman'], '1qIt2gPWwwRzarYVoKg1AE'),
      track('Loneliness', ['Danny Suko', 'MH', 'Marc Korn'], '7HlkEwho4tmESmXN47oh2d'),
      track('You Spin Me Round (Like A Record) - Radio Edit', 'Marc Korn', '5zdbSrKdmK9qDTkqzidcN7'),
      track('What Now', ['WWE', 'John Cena', 'Tha Trademarc'], '23QzyQBnSJg6Hll6dlAbwI'),
      track('Arjen Robben Song', 'Football Poet', '0oEYx1o3UsVwhhcNjmqvrc'),
      track('Dreams (Will Come Alive) - Klaas Remix', ['Danny Suko', 'Marc Korn', 'DJ Squared', 'Klaas'], '0BxlkenSyFXrUnd1VhbvQl')
    ]);

    itAutoMatches('Sunscreem vs Push – Please Save Me', '4bizIO0eSN2UwW1cDd85gu', [
      track('Please Save Me - Push Mix', 'Sunscreem', '4OhwoHmZQ5NZ9xYwIHOf4J'),
      track('Please Save Me - Radio Edit', ['Sunscreem', 'Push'], '4bizIO0eSN2UwW1cDd85gu'),
      track('Universal Nation', 'Push', '1u8gw65yb6kRCBqNDFSwHj'),
      track('Things I\'ve Seen', ['The Spooks', 'Jay Kulkalski'], '673OnqT7JuOTkxyfa0BT0t'),
      track('Gethsemane', 'Sleep Token', '29JLgNBcOky7QB68OrvYxO'),
      track('Tech Noir', ['Gunship', 'John Carpenter', 'Charlie Simpson'], '5VKEsChbUowEF2BT0gJSGX'),
      track('Half Mast', 'Empire Of The Sun', '41e3kXngANxZtiU9xeS5Jh'),
      track('Push Up - Main Edit', 'Creeds', '3AjSfp5FDvwtMU9XBsbS8j'),
      track('Push Up - Original Mix', 'Creeds', '43OMUa5jouGCZEz9k9vooo'),
      track('Things I\'ve Seen - Radio Edit', 'The Spooks', '1h2Q3Um4SJjbqq4FceESL3')
    ]);

    itAutoMatches('Sonata Arctica – Full Moon', '2OcgUwz7uomyLpOi0juero', [
      track('FullMoon', 'Sonata Arctica', '2OcgUwz7uomyLpOi0juero'),
      track('Fullmoon (From "White Pearl, Black Oceans)', 'Sonata Arctica', '7lTHxDZIB1tjt4qSNu9OgW'),
      track('Replica', 'Sonata Arctica', '2A4rfHIusMPUyTN2RAgsKw'),
      track('Tallulah', 'Sonata Arctica', '33F4l7xj1cEeiqyUCfHlvw'),
      track('Victoria\'s Secret', 'Sonata Arctica', '3jA4IA75ZNJFgsYIxXXjLM'),
      track('Freedom Concept', 'Sonata Arctica', '3g8dRL2mQOgqUZVdK4Ba6O'),
      track('Strawberry Moon', 'Foghorn Lonesome', '4uRub77idWWQbPQ98SK3KK'),
      track('Ryda', ['Elport', 'pablø'], '0cviNZbZSoTtTgiO1ggo6Y')
    ]);

    itAutoMatches('Afrojack feat. Eva Simons – Take Over Control', '5DdDbJvoaT8fqQMJkiGg4T', [
      track('Take Over Control (feat. Eva Simons) - Radio Edit', ['AFROJACK', 'Eva Simons'], '5DdDbJvoaT8fqQMJkiGg4T'),
      track('Take Over Control (feat. Eva Simons) [Maddix Remix]', ['AFROJACK', 'Eva Simons', 'Maddix'], '11MH2tLS3KlEUaHbQWdSyP'),
      track('Take Over Control (feat. Eva Simons) [HILLS Remix]', ['AFROJACK', 'Eva Simons', 'HILLS'], '7pEf32tN1BOe1x0T6kNwVt'),
      track('Never Forget You', 'AFROJACK', '5j68TaDRcPBdh27OjKr4l6'),
      track('Meisje', ['Afro Bros', 'Billy Dans', 'Brace', 'Jeffrey Heesen'], '0rRmWgbfX5My6XY0gTa6TF'),
      track('3030', ['Deltron 3030', 'Del The Funky Homosapien', 'Dan The Automator', 'Kid Koala'], '39GBFwBe4GGk7i3yr3F46P'),
      track('Legacy', ['Frvhm', 'Al'], '2ehegm1ZVb87PSoYCclmQ0'),
      track('Flamingo Island', 'Mózo', '085WUSbjyhIxeGrt1sIIS4'),
      track('Part 2', 'NASA', '3tG8U0jL0UXli4jKc6LwEd')
    ]);

    itDoesNotAutoMatch('Billy Ray Martin – Honey', [
      track('Honey', ['Billy Raffoul', 'Booshle G.', 'Tatum Tides'], '1seToxjaUog9m1scdsu4yP'),
      track('Honey - Chicane Club Mix', ['Billie Ray Martin', 'Chicane'], '11pNNDqKk18KAj56uOZxoi'),
      track('Honey', 'Bobby Goldsboro', '2Qhvi6R73Zj3cpzRYzcAww'),
      track('Brother Benjamin', 'Joel Martin from Toledo', '4WBsihio1c2Yw8ecBTC5M0'),
      track('Shoe Game', ['Joey Kay', 'Brn Agn'], '3SiZB3LZULOoGNOflcf7Td'),
      track('Exhale (feat. Smino)', ['Kemba', 'Smino'], '6R7gwnDog4ZyEf9lal14jS'),
      track('SouthWest', ['SouthWest', 'DonnieSo', 'Chris Ray\'s Music'], '5YX1xrUOYUtnK3YDfkLN2u')
    ]);

    itDoesNotAutoMatch('Hardwell & Dyro feat. Bright Lights – Never Say Goodbye', [
      track('Never Say Goodbye - Radio Edit', ['Hardwell', 'Dyro', 'Bright Lights'], '1JEZL8T0JE0868RXp811br'),
      track('Never Say Goodbye (feat. Bright Lights) - Radio Edit', ['Hardwell', 'Dyro', 'Bright Lights'], '2r5qvUU4KPDlFg6SASdqkP'),
      track('Never Say Goodbye (Mix Cut) [feat. Bright Lights] - Original Mix', ['Hardwell', 'Dyro', 'Bright Lights'], '4XfyGJRLhWWa0C3cCFcZ1x'),
      track('Never Say Goodbye - Wildstylez Radio Edit', ['Hardwell', 'Dyro', 'Bright Lights', 'Heather Dawn Bright', 'Wildstylez'], '43yculvYs55hHdH0van082'),
      track('Never Say Goodbye - Wildstylez Remix', ['Hardwell', 'Dyro', 'Bright Lights', 'Heather Dawn Bright', 'Wildstylez'], '60XOz6gkQAgPBz0Kbzu3gB'),
      track('Car\'s Outside', 'James Arthur', '0otRX6Z89qKkHkQ9OqJpKt'),
      track('Elizabeth Taylor', 'Taylor Swift', '6VmoWv16P8CXpVvutfhQVI'),
      track('Car\'s Outside - Sped Up Version', 'James Arthur', '6OmKbLCskNWi1IcfpZbeJc')
    ]);
  });
});
