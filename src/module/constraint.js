module.exports = {
    UNIQUE_ACCOUNT_EMAIL: "unique_account_tb_email",
    UNIQUE_CLUB_NAME: "unique_club_tb_name",

    FK_ACCOUNT: "fk_account_tb_to_club_member_tb",
    FK_CLUB: "fk_club_tb_to_join_request_tb",
    FK_MAJOR: "fk_major_tb_to_account_tb",
    FK_BELONG: "fk_belong_tb_to_club_tb",
    FK_BIG_CATEGORY: "fk_big_category_tb_to_club_tb",
    FK_SMALL_CATEGORY: "fk_small_category_tb_to_club_tb",
    FK_POSITION: "fk_position_tb_to_club_member_tb",

    // NOTICE
    NOTICE_POST_IMG_TB : {
        FK_POST_ID: "fk_notice_post_tb_to_notice_post_img_tb",
    },

    FK_BOARD: "fk_club_board_tb_to_club_post_tb",
    FK_CLUB_POST: "fk_club_post_tb_to_post_img_tb"
}
