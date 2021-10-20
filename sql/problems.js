module.exports = {

    //==================SELECT==================== 
    selectTagById: "select * from plass_total_categories where id = ?",
    selectTutorials: "select * from plass_total_categories where parent_id = 0",
    getCategoryProblems : "select * from plass_total_categories where parent_id = 0",
    selectTagsByTutorialId: "select * from plass_total_categories where parent_id = ?",
    selectTagsByTutorialId2: "select tags.id,tags.name from plass_total_categories where parent_id = ?",
    getNameTag: "select name from plass_total_categories where id = ?",
    selectCategoryInfoById: "select * from plass_total_categories where id = ?",
    getCategories: "select * from plass_total_categories",
    //PROBLEM
    selectProblemsByTagId: `select p.*,ts.input_example,ts.output_example from plass_problems as p, plass_problem_category as pt, plass_testcases as ts 
    where p.id = pt.problem_id and p.id = ts.problem_id and pt.category_id = ?`,
    selectProblems: "select * from plass_problems",
    selectProblemById: "select * from plass_problems where id = ?",
    selectCategoryFromProblemId: "select * from plass_total_categories where id = (select category_id FROM plass_problem_category where problem_id = ?)",
    selectTestCaseFromProblemId: "select * from plass_testcases where problem_id = ?",
    selectProblemByCategoryId: `select pbl.*, ptc.name as category_name FROM plass_problems as pbl,  plass_problem_category as pc, plass_total_categories as ptc where  
    pbl.id = pc.problem_id and  pc.category_id = ? and pc.category_id  = ptc.id`,
    selectTestCaseByProblemId: `select id, input_example as input, output_example as output from plass_testcases where problem_id = ?`,
    selectAnswerByProblemId: "select * from plass_problem_multiplechoice_answer where problem_id = ?",
    getCountProblem: "SELECT COUNT(id) as count FROM plass_problems",
    selectProblemSubmit: "SELECT * FROM plass_problem_submit where user_id = ? and problem_id = ?",
    selectProblemProcessor: "select * from plass_problem_submit as pps where problem_id = ? and user_id = ? order by id desc limit 1;",
    //my list
    selectMyProblemById: "select * from plass_mylist_problem where user_id =?, problem_id =?",
    selectProblemSubmitByUserId: "SELECT * FROM plass_problem_submit where user_id = ?",


    //MULTICHOICE PROBLEM
    selectMultiChoiceProblem: "select * from plass_problem_multiplechoice where name = ? and content = ?",
    selectCategoryFromMultiProblems: "select * from plass_total_categories where id = (select category_id FROM plass_problem_multiplechoice_category where problem_id = ?)" ,
    selectMultiProblems: "select * from plass_problem_multiplechoice",
    selectMultiChoiceProblemById: "select * from plass_problem_multiplechoice where id =?",
    selectCategoryFromMultiProblemId: "select * from plass_total_categories where id = (select category_id FROM plass_problem_multiplechoice_category where problem_id = ?)",
    selectMultiChoiceSubmit: "select * from plass_problem_multiplechoice_submit where user_id = ? and problem_id = ?",
    selectSubmitMultiChoiceProblem: "select * from plass_problem_multiplechoice_answer where problem_id =? and id = ?",
    getCountMultiChoiceProblem: "SELECT COUNT(id) as count FROM plass_problem_multiplechoice",
    selectMultiChoiceSubmitByUserId: "SELECT * FROM plass_problem_multiplechoice_submit where user_id = ?",
    
    //SHORTANS PROBLEM
    selectShortProblem: "select * from plass_problem_shortans where name = ? and content = ?",
    getMyListProblem: "select mp.*, p.name, p.content  from plass_mylist_problem as mp, plass_problems as p where mp.user_id = ? and mp.problem_id = p.id order by problem_type desc",
    selectCategoryFromShortantsProblems: "select * from plass_total_categories where id = (select category_id FROM plass_problem_shortanswer_category where problem_id = ?)" ,
    selectShortansProblems: "select * from plass_problem_shortans",
    selectAnswerByShortansPro: "select * from plass_problem_shortans_answer where problem_id = ?",
    selectShortProblemById: "select * from plass_problem_shortans where id = ?",
    //selectTestCaseByProblemId: `select id, input_example as input, output_example as output from plass_testcases where problem_id = ?`,
    getCountShortProblem: "SELECT COUNT(id) as count FROM plass_problem_shortans",
    selectShortansSubmit: "SELECT * FROM plass_problem_shortans_submit where user_id = ?",
    selectShortansSubmitByUserProblem: "SELECT * FROM plass_problem_shortans_submit where user_id = ? and problem_id = ?",

    //OTHER
    checkLikeProblem: "select * from plass_mylist_problem where user_id = ? and problem_id = ?",
    setProblemMyList: "insert into plass_mylist_problem(user_id, problem_id, problem_type) values (?, ?, ?)",
    

    //==================INSERT==================== 
    //PROBLEM
    insertProblemTag: "insert into plass_problem_category(problem_id, category_id) values (?, ?)",
    insertTestCase: "insert into plass_testcases input_example =?,output_example =?, problem_id = ? where id= ?",
    insertProblemSubmit: "insert into plass_problem_submit(user_id, problem_id, language_id, answer_status, status, path, times) values (?,?,?,?,?,?,?)",

    //MULTICHOICE PROBLEM
    insertMultiChoiceProblem: "insert into plass_problem_multiplechoice(name, content, level) values(?, ?, ?)",
    insertMultiChoiceProblemTag: "insert into plass_problem_multiplechoice_category(problem_id, category_id) values(?, ?)",
    insertMultiChoiceSubmit: "insert into plass_problem_multiplechoice_submit(user_id, problem_id, answer_status, answer_id) values (?, ?, ?, ?)",
    
    //SHORTANS PROBLEM
    insertShortProblem: "insert into plass_problem_shortans(name, content, level) values(?, ?, ?)",
    insertShortProblemTag: "insert into plass_problem_shortanswer_category (problem_id, category_id) values(?, ?)",
    insertShortSubmit: "insert into plass_problem_shortans_submit(user_id, problem_id, answer_status, content) values(?,?,?,?)",

    //==================UPDATE====================
    //PROBLEM
    updateProblem: "update plass_problems set name = ?, content = ?,  input = ?, output =?, level = ?  where id = ?",
    updateTestCaseProblem: "update plass_testcases set input_example = ?, output_example =? where problem_id =?",
    updateProblemTag: "update plass_problem_category  set  category_id = ? where problem_id = ?",
    updateProblemSubmit: "update plass_problem_submit set  language_id = ?, answer_status = ? , status = ?, path = ? where problem_id = ? and user_id = ?",
    //MULTICHOICE PROBLEM
    updateMultiChoiceProblem:`update plass_problem_multiplechoice set name = ?, content =?, level =? where id = ?`,
    // update plass_problems_multiplechoice_answer set problem_id = ?, answer_content = ?, is_correct where id = ?;
    // update plass_problems_multiplechoice_category set problem_id = ?, category_id = ? where id = ?`,
    updateMultiChoiceProblemTag: "UPDATE plass_problem_multiplechoice_category SET category_id = ? WHERE problem_id = ?",
    updateMultiChoiceSubmit: "update plass_problem_multiplechoice_submit set answer_status = ?, answer = ? WHERE problem_id = ? and user_id = ?",
    //SHORTANS PROBLEM
    updateShortansProblem: "update plass_problem_shortans set name = ?, content = ?, level = ? where id = ?",
    updateShortansTag: "update plass_problem_shortanswer_category set  category_id = ? where problem_id = ?",
    updateShortansSubmit: "update plass_problem_shortans_submit set answer_status = ?, content = ? where user_id = ? and problem_id = ?",
    //==================DELETE====================
    //PROBLEM
 
    deleteTestCaseProblem: "delete from plass_testcases where problem_id = ?",
    deleteCategoryProblem: "delete from plass_problem_category where problem_id = ?",
    deleteProblem : "delete from plass_problems where id = ?",

    //MULTICHOICE PROBLEM
    deleteMultiChoiceProblem : "delete from plass_problem_multiplechoice where id = ?",
    //deleteAnswerMultiChoieProblem: "delete from plass_problem_multiplechoice_answer where problem_id = ?",
    deleteMultiChoiceCategoryProblem: "delete from plass_problem_multiplechoice_category where problem_id = ?",
    deleteAnswerMultiChoieProblem: "delete from plass_problem_multiplechoice_answer where problem_id = ?",
    deleteMultiChoiceCategoryProblem: "delete from plass_problem_multiplechoice_category where problem_id = ?",
    
    //SHORTANS PROBLEM
    deleteShortansProblem : "delete from plass_problem_shortans where id = ? ",
    deleteAnswerShortansProblem: "delete from plass_problem_shortans_answer where problem_id = ?",
    deleteShortansCategoryProblem: "delete from plass_problem_shortanswer_category where problem_id = ?",

    //OTHER
    removeProblemMyList: "delete from plass_mylist_problem where user_id = ? and problem_id = ? and problem_type = ?",
    deleleMyProblem : "delete from plass_mylist_problem where id = ?",
}