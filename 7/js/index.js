(function ($) {
	var reportController = {
		__name: 'handson.ReportController',

		__ready: function () {
			this.$find('input[name="reportDate"]').val(
				handson.utils.formatDateWithHyphen(new Date())
			);
			this.$find('input[name="startTime"]').val('09:00');
			this.$find('input[name="endTime"]').val(
				handson.utils.formatTime(new Date()));
		},

		'#startTime, #endTime focusout': function (context, $el) {
			var start = this.$find("#startTime").val(); // 開始時刻の取得
			var end = this.$find("#endTime").val();     // 終了時刻の取得
			start = handson.utils.createDateFromTimeString(start);
			end = handson.utils.createDateFromTimeString(end);
			var $error = this.$find('.report-content').find('.alert-danger');  // エラーメッセージを出す場所
			var $warning = this.$find('.report-content').find('.alert-warning');  // 警告メッセージを出す場所  
			if (end <= start) {
				// エラー状態
				if (this.$find('p[data-error-type="duration"]').length == 0) {
					var $p = $('<p data-error-type="duration">');
					$p.append('<strong>勤務の開始時刻より終了時刻が後になるように入力してください</strong>');
					$error.append($p);
				}
			} else {
				// 正常状態
				// 入力した項目のメッセージを消す
				$error.find('p[data-error-type="duration"]').remove();

				if (end - start > 12) {
					var $p = $('<p data-warning-type="too-long-work">');
					$p.append('<strong>勤務時間が長くなっています</strong>');
					$warning.append($p);
				} else {
					$warning.find('[data-warning-type="too-long-work"]').remove();
				}
			}
		},
		'input, textarea focusout': function (context, $el) {
			// 変数の定義
			var value = $el.val();
			var name = $el.attr('name');
			var error_class = 'has-error';
			var $msg = this.$find('.report-content').find('.alert-danger');
			var $formGroup = $el.parents('.form-group');

			// 除外条件の設定
			if (name == 'img') {
				return;
			}

			// 入力チェック
			if (value == null || value == '') {
				// 入力されていない場合の処理
				if ($formGroup.hasClass(error_class)) {
					// すでにエラー表示があるならば何もしない
					return;
				}

				// 空の入力項目に赤い枠を追加
				$formGroup.addClass(error_class);

				// 入力項目名（日本語）を取得
				var label = $formGroup.find('label').text();

				// メッセージの組み立て
				var $p = $('<p data-handson-input-name="' + name + '">');
				$p.append('<strong>' + label + 'を入力してください' + '</strong>');

				// エラーメッセージの挿入
				$msg.append($p);
			} else {
				// 入力されている場合の処理
				// エラーの枠を外す
				$formGroup.removeClass(error_class);

				// 入力した項目のメッセージを消す
				$msg.find('p[data-handson-input-name="' + name + '"]').remove();
			}

			// メッセージの表示、非表示の指定
			if ($msg.children().length != 0) {
				// エラーあり
				$msg.show();
			} else {
				// エラーなし
				$msg.hide();
			}
		},

		'input[name="img"] change': function (context, $el) {
			// 変数の定義
			var $imgPreview = this.$find('.img-preview');

			// input要素からファイルを取得
			var file = $el[0].files[0];

			// FileReaderインスタンスの作成
			var reader = new FileReader();

			// ファイルが読み込まれた時の処理を記述
			reader.onload = function (e) {
				// 画像を表示
				$imgPreview.find('img').attr('src', e.target.result);
				$imgPreview.show();
			};
			// ファイル読み込み開始
			reader.readAsDataURL(file);
		},

		'.confirm click': function (context, $el) {
			// 初期化
			context.event.preventDefault();
			$('.modal-content').empty();

			// パラメータの設定
			var params = {};
			var ary = $('form').serializeArray();
			for (i in ary) {
				params[ary[i].name] = ary[i].value;
			}

			// 複数行対応分のエスケープ処理
			params.comment = handson.utils.escapeHTML(params.comment)

			// ビューの設定
			this.view.append('.modal-content', 'confirm', params);

			// モーダル表示
			$('#confirmModal').modal();
		},

		'.register click': function (context, $el) {
			// Ajaxの擬似的実行
			h5.ajax({
				type: 'post',
				data: $('form').serialize(),
				url: '/register'
			}).then(function () {
				alert('登録しました');
				$('#confirmModal').modal('hide');
			})
		}
	};

	h5.core.expose(reportController);
})(jQuery);
$(function () {
	h5.core.controller(document.body, handson.ReportController);
});