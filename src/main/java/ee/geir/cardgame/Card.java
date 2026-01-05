package ee.geir.cardgame;

public enum Card {
    // Spades
    S2("2 of Spades", 2),
    S3("3 of Spades", 3),
    S4("4 of Spades", 4),
    S5("5 of Spades", 5),
    S6("6 of Spades", 6),
    S7("7 of Spades", 7),
    S8("8 of Spades", 8),
    S9("9 of Spades", 9),
    S10("10 of Spades", 10),
    SJ("Jack of Spades", 10),
    SQ("Queen of Spades", 10),
    SK("King of Spades", 10),
    SA("Ace of Spades", 10),

    // Hearts
    H2("2 of Hearts", 2),
    H3("3 of Hearts", 3),
    H4("4 of Hearts", 4),
    H5("5 of Hearts", 5),
    H6("6 of Hearts", 6),
    H7("7 of Hearts", 7),
    H8("8 of Hearts", 8),
    H9("9 of Hearts", 9),
    H10("10 of Hearts", 10),
    HJ("Jack of Hearts", 10),
    HQ("Queen of Hearts", 10),
    HK("King of Hearts", 10),
    HA("Ace of Hearts", 10),

    // Diamonds
    D2("2 of Diamonds", 2),
    D3("3 of Diamonds", 3),
    D4("4 of Diamonds", 4),
    D5("5 of Diamonds", 5),
    D6("6 of Diamonds", 6),
    D7("7 of Diamonds", 7),
    D8("8 of Diamonds", 8),
    D9("9 of Diamonds", 9),
    D10("10 of Diamonds", 10),
    DJ("Jack of Diamonds", 10),
    DQ("Queen of Diamonds", 10),
    DK("King of Diamonds", 10),
    DA("Ace of Diamonds", 10),

    // Clubs
    C2("2 of Clubs", 2),
    C3("3 of Clubs", 3),
    C4("4 of Clubs", 4),
    C5("5 of Clubs", 5),
    C6("6 of Clubs", 6),
    C7("7 of Clubs", 7),
    C8("8 of Clubs", 8),
    C9("9 of Clubs", 9),
    C10("10 of Clubs", 10),
    CJ("Jack of Clubs", 10),
    CQ("Queen of Clubs", 10),
    CK("King of Clubs", 10),
    CA("Ace of Clubs", 10);

    public final String name;
    public final int strength;

    Card(String name, int strength) {
        this.name = name;
        this.strength = strength;
    }
}
