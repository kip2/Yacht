#!/usr/bin/env fish

# 引数チェック
if test (count $argv) -lt 1
    echo "Usage: "(status filename)" [test|--test|-t]  <file1.d> [file2.d ...]" 
    exit 1
end

set -l is_test 0
set -l files

# set -l input_file $argv[1]

# モード判定
# set -l is_test 0
set -l first $argv[1]
switch $first
    case test --test -t
        set is_test 1
        set files $argv[2..-1]
    case '*'
        set files $argv
end

if test (count $files) -lt 1
    echo "Error: no input .d files."
    echo "Usage: "(status filename)" [test|--test|-t]  <file1.d> [file2.d ...]" 
    exit 1
end

set -l base_name (basename $files[1] .d)

# dmdオプションの組み立て
set -l dmd_opts -of=$base_name
if test $is_test -eq 1
    set dmd_opts $dmd_opts -unittest
end

# コンパイル（出力ファイル名を明示）
dmd $files $dmd_opts
if test $status -ne 0
    echo "[ERROR] Failed to compile."
    exit 1
end

# 実行
./$base_name
set -l run_status $status

# 生成物を削除
rm -f $base_name
for f in $files
    rm -f (basename $f .d).o
end

exit $run_status

