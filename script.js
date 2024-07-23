angular.module('myApp', [])
    .controller('myCtrl', function ($scope, $filter, $timeout) {

        // tooltip
        let todoTooltipBox = Array.from(document.querySelectorAll('.todo__tooltip-box'));

        function hideAllTooltip() {
            todoTooltipBox.forEach(box => box.style.display = 'none');
        }

        function showTooltip(currentIndex) {
            todoTooltipBox[currentIndex].style.display = 'block';
        }

        function resetBool() {
            $scope.isToolTip = $scope.isInputText = $scope.isSubmitBtn = $scope.isInputSearch = false;
        }

        let toolIndex = 0;
        $scope.showToolTip = function () {
            $scope.isToolTip = !$scope.isToolTip;
            hideAllTooltip();
            toolIndex = 0;
            showTooltip(toolIndex);
            $scope.isInputText = true;
        }
        $scope.tooltipNext = function () {
            hideAllTooltip();
            toolIndex++;
            showTooltip(toolIndex);

            // console.log(typeof toolIndex, "type")
            if (toolIndex === 1) {
                $scope.isSubmitBtn = true;
                $scope.isInputText = false;
            }
            if (toolIndex === 2) {
                $scope.isInputSearch = true;
                $scope.isSubmitBtn = false;
                $scope.isInputText = false;
            }
        }
        $scope.tooltipFinish = function () {
            hideAllTooltip();
            resetBool();
        }
        // end




        // Initialize todos object and items
        $scope.todos = { isComplete: false, todo: '' };
        $scope.items = JSON.parse(localStorage.getItem("todo"))
            || [{ isComplete: false, todo: 'I will start going to the gym next month' },
            { isComplete: false, todo: 'I will start learning a new skill tomorrow' },
            { isComplete: false, todo: 'I will begin reading a new book tomorrow' }];

        // console.log($scope.items, "check || value")
        $scope.fill = false;
        $scope.updateVal = false;
        $scope.filteredItems = $scope.items;

        // tracking input field
        $scope.changinInput = function () {
            $scope.fill = false;
        }
        
        // Function to add or update todo items
        $scope.formSubmit = function () {
            if ($scope.todos.todo === '') {
                $scope.fill = true;
                $scope.writeSome = 'Please write something';
            } else {
                if ($scope.updateVal) {
                    $scope.items[$scope.editId] = $scope.todos;
                } else {
                    $scope.items.unshift($scope.todos);
                }
                $scope.fill = false;
                $scope.updateVal = false;
                $scope.todos = { isComplete: false, todo: '' }; // Reset form
                localStorage.setItem("todo", JSON.stringify($scope.items));
                $scope.filteredItems = $scope.items;
                $scope.updateNumberOfPage();
            }
        };

        // Function to handle completion or checked state
        $scope.isCompFunc = function (index) {
            $scope.items[index].isComplete = $scope.items[index].isComplete;
            localStorage.setItem("todo", JSON.stringify($scope.items));
            $scope.filteredItems = $scope.items;
        };

        // Function to edit todo item
        $scope.edit = function (i) {
            $scope.editId = i;
            $scope.updateVal = true;
            $scope.todos = angular.copy($scope.filteredItems[i]);
            document.getElementById('myInput').focus();

        };

        // Function to remove todo item
        $scope.remove = function (index) {
            if (index !== -1) {
                $scope.items.splice(index, 1);
                localStorage.setItem("todo", JSON.stringify($scope.items));
                $scope.filteredItems = $scope.items;
                $scope.updateNumberOfPage();
            }
        };

        // Function to filter items based on search input
        $scope.inputFilter = function () {
            $scope.filteredItems = $filter('filter')($scope.items, $scope.filterVal);
            $scope.currentPage = 0;
            $scope.updateNumberOfPage();
        };

        // Function to handle the change in number of items to show
        $scope.showItemChange = function () {
            $scope.updateNumberOfPage();
        };

        // Initialize pagination variables
        $scope.currentPage = 0;
        $scope.showItem = 5;

        // Function to update the number of pages
        $scope.updateNumberOfPage = function () {
            $scope.numberOfPages = Math.ceil($scope.filteredItems.length / $scope.showItem);
            $scope.pagesVal = Array.from({ length: $scope.numberOfPages }, (v, k) => k + 1);
        };
        $scope.updateNumberOfPage();

        // Function to change page
        $scope.setPage = function (index) {
            $scope.currentPage = index;
        };
    });
