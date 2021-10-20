module.exports = {
  user: require('./user'),
  problems: require('./problems'),
  selectTestCaseByProblemId: `select id, input_example as input, output_example as output from testCases where problem = ?`,
  selectProblemByNameContent: "select * from `problems`.`plass_problems` where name = ? and content = ?",
  insertProblem: "INSERT INTO problems.plass_problems (name, content, language, input, output, level) VALUES (?, ?, ?, ?, ?, ?)",
  

  insertTestCase: function (testCasesCount = 1) {
    if (testCasesCount < 1)
      throw new Error("test case는 1개 이상이여야 합니다.");
    let query = "INSERT INTO problems.plass_testcases ( input_example, output_example, problem_id) VALUES";
    for (let i = 0; i < testCasesCount; i++) {
      query += "(?, ?, ?)";
      if (i + 1 !== testCasesCount) query += " , ";
    }
    return query;
  },
  insertTestCaseProblem: function (testCasesCount = 1) {
    if (testCasesCount < 1)
      throw new Error("test case는 1개 이상이여야 합니다.");
    let query = "INSERT INTO pb_test_testcases( input_example, output_example, problem_id) VALUES";
    for (let i = 0; i < testCasesCount; i++) {
      query += "(?, ?, ?)";
      if (i + 1 !== testCasesCount) query += " , ";
    }
    return query;
  },


  // updateTestCase: function (testCasesCount = 1) {
  //   if (testCasesCount < 1)
  //     throw new Error("test case는 1개 이상이여야 합니다.");
  //   let query =
  //     "UPDATE problems.plass_testcases SET input_example =? , output_example =? where problem_id = ?";
  //     console.log(query)
  //   for (let i = 0; i < testCasesCount; i++) {
  //     query += "(?, ?, ?)";
  //     if (i + 1 !== testCasesCount) query += ", ";
  //   }
  //   return query;
  // },

  insertMultiChoiceAnswer: function (answer = 1) {
    if (answer < 1)
      throw new Error("test case는 1개 이상이여야 합니다.");
    let query =
      "INSERT INTO problems.plass_problem_multiplechoice_answer(answer_content, problem_id, is_correct) VALUES";
    for (let i = 0; i < answer; i++) {
      query += "(?, ?, ?)";
      if (i + 1 !== answer) query += " , ";
    } 
    return query;
  },

  insertShortAnswer: function (answer = 1) {
    if (answer < 1)
      throw new Error("test case는 1개 이상이여야 합니다.");
    let query =
    "INSERT INTO problems.plass_problem_shortans_answer (answer_content, problem_id ) VALUES";
    for (let i = 0; i < answer; i++) {
      query += "(?, ?)";
      if (i + 1 !== answer) query += ", ";
    }
    return query;
  },
  // selectTestCaseByProblemId: `select id, input_example as input, output_example as output from testCases where problem = ?`,
};
